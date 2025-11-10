import numpy as np
from typing import Dict, List, Tuple
from collections import defaultdict


class MultiArmedBandit:
    """
    Contextual Multi-Armed Bandit for recommendation optimization.
    Uses Upper Confidence Bound (UCB) strategy with context awareness.
    """

    def __init__(
        self,
        epsilon: float = 0.1,
        epsilon_decay: float = 0.995,
        min_epsilon: float = 0.01,
    ):
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay
        self.min_epsilon = min_epsilon

        # Track rewards for each resource type and ID
        self.rewards = defaultdict(lambda: defaultdict(list))
        self.counts = defaultdict(lambda: defaultdict(int))

    def select_action(
        self, resource_type: str, candidates: List[Dict], scores: Dict[str, float]
    ) -> str:
        """
        Select best resource using epsilon-greedy with UCB.
        """
        if np.random.random() < self.epsilon:
            # Exploration: random selection
            return np.random.choice([c["id"] for c in candidates])

        # Exploitation: select based on UCB score
        best_id = None
        best_ucb = -float("inf")

        total_counts = sum(self.counts[resource_type].values())

        for candidate in candidates:
            resource_id = candidate["id"]
            base_score = scores.get(resource_id, 0.0)

            # Calculate UCB bonus
            count = self.counts[resource_type][resource_id]
            if count == 0:
                ucb_bonus = 1.0  # High bonus for unexplored options
            else:
                ucb_bonus = np.sqrt(2 * np.log(total_counts + 1) / count)

            ucb_score = base_score + ucb_bonus

            if ucb_score > best_ucb:
                best_ucb = ucb_score
                best_id = resource_id

        return best_id

    def update(self, resource_type: str, resource_id: str, reward: float):
        """
        Update the bandit with feedback from a placement.
        """
        self.rewards[resource_type][resource_id].append(reward)
        self.counts[resource_type][resource_id] += 1

        # Decay epsilon for less exploration over time
        self.epsilon = max(self.min_epsilon, self.epsilon * self.epsilon_decay)

    def get_average_reward(self, resource_type: str, resource_id: str) -> float:
        """
        Get historical success rate for a resource.
        """
        rewards_list = self.rewards[resource_type].get(resource_id, [])
        if not rewards_list:
            return 0.5  # Neutral default for cold start
        return np.mean(rewards_list)

    def get_stats(self) -> Dict:
        """
        Get statistics about the bandit's learning.
        """
        stats = {}
        for resource_type in self.rewards:
            stats[resource_type] = {
                "total_interactions": sum(self.counts[resource_type].values()),
                "unique_resources": len(self.counts[resource_type]),
                "avg_reward": np.mean(
                    [
                        np.mean(rewards)
                        for rewards in self.rewards[resource_type].values()
                        if rewards
                    ]
                )
                if self.rewards[resource_type]
                else 0.0,
            }
        return stats
