from typing import Dict, List, Tuple
from models.bandit import MultiArmedBandit
from models.scorer import RecommendationScorer
from config import Config


class RecommendationEngine:
    """
    Main recommendation engine coordinating bandit and scoring.
    """

    def __init__(self):
        self.bandit = MultiArmedBandit(
            epsilon=Config.EPSILON,
            epsilon_decay=Config.EPSILON_DECAY,
            min_epsilon=Config.MIN_EPSILON,
        )
        self.scorer = RecommendationScorer(bandit=self.bandit)
        self.ab_test_variant = "A"  # Default variant

    def recommend(
        self,
        individual: Dict,
        resources: List[Dict],
        resource_type: str,
        top_k: int = 5,
        use_bandit: bool = True,
    ) -> List[Dict]:
        """
        Generate top-k recommendations for an individual.
        """
        if not resources:
            return []

        # Calculate scores for all candidates
        scored_resources = []
        scores_dict = {}

        for resource in resources:
            score, explanation = self.scorer.calculate_composite_score(
                individual, resource, resource_type
            )
            scores_dict[resource["id"]] = score

            scored_resources.append(
                {"resource": resource, "score": score, "explanation": explanation}
            )

        # Sort by score
        scored_resources.sort(key=lambda x: x["score"], reverse=True)

        # If using bandit, reorder top candidates
        if use_bandit and len(scored_resources) > 0:
            # Get top candidates for bandit selection
            top_candidates = scored_resources[: min(top_k * 2, len(scored_resources))]

            # Let bandit select the best one
            best_id = self.bandit.select_action(
                resource_type,
                [item["resource"] for item in top_candidates],
                scores_dict,
            )

            # Move selected to front
            for i, item in enumerate(top_candidates):
                if item["resource"]["id"] == best_id:
                    if i > 0:
                        top_candidates.insert(0, top_candidates.pop(i))
                    break

            # Combine with remaining
            scored_resources = top_candidates + scored_resources[len(top_candidates) :]

        # Return top-k with explanations
        results = []
        for item in scored_resources[:top_k]:
            results.append(
                {
                    "resource_id": item["resource"]["id"],
                    "resource_name": item["resource"].get("name", "Unknown"),
                    "resource_type": resource_type,
                    "score": item["score"],
                    "explanation": item["explanation"],
                    "resource_details": item["resource"],
                }
            )

        return results

    def provide_feedback(
        self,
        resource_type: str,
        resource_id: str,
        success: bool,
        outcome_score: float = None,
    ):
        """
        Update the model with feedback from a placement.
        """
        if outcome_score is not None:
            reward = outcome_score
        else:
            reward = 1.0 if success else 0.0

        self.bandit.update(resource_type, resource_id, reward)

    def get_statistics(self) -> Dict:
        """
        Get learning statistics.
        """
        return {
            "bandit_stats": self.bandit.get_stats(),
            "epsilon": self.bandit.epsilon,
            "ab_test_variant": self.ab_test_variant,
        }

    def set_ab_variant(self, variant: str):
        """
        Set A/B testing variant.
        """
        self.ab_test_variant = variant
        if variant == "B":
            # Variant B: More exploration
            self.bandit.epsilon = min(0.2, self.bandit.epsilon * 1.5)
