import numpy as np
from typing import Dict, List
from scipy.spatial.distance import euclidean
from config import Config


class RecommendationScorer:
    """
    Calculates weighted scores for matching individuals with resources.
    """

    def __init__(self, bandit=None):
        self.bandit = bandit

    def calculate_location_score(
        self, individual_location: tuple, resource_location: tuple
    ) -> float:
        """
        Calculate proximity score (closer is better).
        """
        if not individual_location or not resource_location:
            return 0.5

        distance = euclidean(individual_location, resource_location)
        # Normalize: assume max relevant distance is 50 units (e.g., km)
        normalized_distance = min(distance / 50.0, 1.0)
        return 1.0 - normalized_distance

    def calculate_skill_match_score(
        self, individual_skills: List[str], required_skills: List[str]
    ) -> float:
        """
        Calculate skill alignment score.
        """
        if not required_skills:
            return 1.0
        if not individual_skills:
            return 0.0

        individual_set = set(s.lower() for s in individual_skills)
        required_set = set(s.lower() for s in required_skills)

        matches = len(individual_set.intersection(required_set))
        return matches / len(required_set)

    def calculate_availability_score(
        self, resource_capacity: int, resource_occupied: int
    ) -> float:
        """
        Calculate availability score based on capacity.
        """
        if resource_capacity <= 0:
            return 0.0

        available = resource_capacity - resource_occupied
        if available <= 0:
            return 0.0

        utilization = resource_occupied / resource_capacity
        # Prefer resources that aren't too empty or too full
        if utilization < 0.3:
            return 0.7 + (utilization / 0.3) * 0.3
        elif utilization < 0.8:
            return 1.0
        else:
            return 1.0 - ((utilization - 0.8) / 0.2) * 0.5

    def calculate_priority_score(
        self, individual_priority: str, resource_priority_support: List[str]
    ) -> float:
        """
        Calculate priority alignment score.
        """
        priority_levels = {"low": 1, "medium": 2, "high": 3, "critical": 4}

        individual_level = priority_levels.get(individual_priority.lower(), 2)

        if not resource_priority_support:
            return 0.5

        supported_levels = [
            priority_levels.get(p.lower(), 2) for p in resource_priority_support
        ]

        if individual_level in supported_levels:
            return 1.0

        # Partial score based on proximity
        min_diff = min(abs(individual_level - level) for level in supported_levels)
        return max(0.0, 1.0 - (min_diff * 0.25))

    def calculate_historical_score(self, resource_type: str, resource_id: str) -> float:
        """
        Get historical success rate from the bandit.
        """
        if self.bandit:
            return self.bandit.get_average_reward(resource_type, resource_id)
        return 0.5

    def calculate_composite_score(
        self, individual: Dict, resource: Dict, resource_type: str
    ) -> Tuple[float, Dict]:
        """
        Calculate weighted composite score with explanation.
        """
        # Location score
        location_score = self.calculate_location_score(
            individual.get("location"), resource.get("location")
        )

        # Skill match score
        skill_score = self.calculate_skill_match_score(
            individual.get("skills", []), resource.get("required_skills", [])
        )

        # Availability score
        availability_score = self.calculate_availability_score(
            resource.get("capacity", 0), resource.get("occupied", 0)
        )

        # Priority score
        priority_score = self.calculate_priority_score(
            individual.get("priority", "medium"),
            resource.get("priority_support", ["low", "medium", "high"]),
        )

        # Historical score
        historical_score = self.calculate_historical_score(
            resource_type, resource["id"]
        )

        # Calculate weighted composite
        composite = (
            Config.WEIGHT_LOCATION * location_score
            + Config.WEIGHT_SKILL_MATCH * skill_score
            + Config.WEIGHT_AVAILABILITY * availability_score
            + Config.WEIGHT_PRIORITY * priority_score
            + Config.WEIGHT_HISTORICAL * historical_score
        )

        # Cold start bonus
        if (
            self.bandit
            and self.bandit.counts[resource_type][resource["id"]]
            < Config.MIN_INTERACTIONS_FOR_LEARNING
        ):
            composite += Config.COLD_START_BONUS

        explanation = {
            "location_score": round(location_score, 3),
            "skill_match_score": round(skill_score, 3),
            "availability_score": round(availability_score, 3),
            "priority_score": round(priority_score, 3),
            "historical_score": round(historical_score, 3),
            "composite_score": round(composite, 3),
        }

        return composite, explanation
