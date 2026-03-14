from agent.core.schemas import Recommendation, TripConstraints


def rank(recommendations: list[Recommendation], constraints: TripConstraints) -> list[Recommendation]:
    interests_lower = {i.lower() for i in constraints.interests}
    dining_lower = {d.lower() for d in constraints.dining_preferences}

    for rec in recommendations:
        score = 0.0

        if rec.category.lower() in interests_lower:
            score += 3.0

        for tag in rec.tags:
            if tag.lower() in interests_lower | dining_lower:
                score += 1.0

        if rec.description:
            score += 0.5

        rec.score = round(score, 1)

    return sorted(recommendations, key=lambda r: r.score, reverse=True)
