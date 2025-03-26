import json
from scipy.stats import kendalltau
from sklearn.metrics import cohen_kappa_score


def load_jsonl(filepath):
    with open(filepath, 'r') as f:
        return [json.loads(line) for line in f]


def extract_from_sample(sample):
    # Rankings
    gpt_rank_dict = sample['gpt_ranking']
    human_rank_dict = sample['human_ranking']
    image_urls = list(gpt_rank_dict.keys())
    gpt_ranks = [gpt_rank_dict[url] for url in image_urls]
    human_ranks = [human_rank_dict[url] for url in image_urls]
    return gpt_ranks, human_ranks


def extract_alignment_ratings(sample):
    gpt = sample['gpt_alignment']
    human = sample['human_alignment']
    ratings = [[gpt['background'], human['background']]]

    for key in gpt['text']:
        ratings.append([gpt['text'][key], human['text'][key]])

    return ratings


def compute_agreement(jsonl_path):
    data = load_jsonl(jsonl_path)

    all_gpt_likert = []
    all_human_likert = []
    kendall_scores = []

    for sample in data:
        # Rankings
        gpt_ranks, human_ranks = extract_from_sample(sample)
        tau, _ = kendalltau(gpt_ranks, human_ranks)
        kendall_scores.append(tau)

        # Alignments
        ratings = extract_alignment_ratings(sample)
        for gpt_score, human_score in ratings:
            all_gpt_likert.append(gpt_score)
            all_human_likert.append(human_score)

    # Agreement metrics
    kappa = cohen_kappa_score(all_gpt_likert, all_human_likert)
    avg_kendall = sum(k for k in kendall_scores if k is not None) / len(kendall_scores)

    return {
        'Cohen_kappa_alignment': kappa,
        'Average_kendall_tau_ranking': avg_kendall
    }


if __name__ == "__main__":
    result = compute_agreement("input.jsonl")
    print(result)
