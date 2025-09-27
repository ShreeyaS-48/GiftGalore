import os
from pymongo import MongoClient
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get("DB")
DB_NAME = "test"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
# Fetch orders
orders = list(db.orders.find({}, {"user": 1, "items.product._id": 1}))

# Create a list of (user, product) tuples
user_product = []
for order in orders:
    user_id = str(order["user"])
    for item in order.get("items", []):
        if "product" in item and "_id" in item["product"]:
            user_product.append((user_id, str(item["product"]["_id"])))

# Convert to DataFrame
df = pd.DataFrame(user_product, columns=["user_id", "product_id"])
user_item_matrix = df.groupby(['user_id', 'product_id']).size().unstack(fill_value=0)
user_item_matrix[user_item_matrix > 0] = 1  # binary purchase
from sklearn.metrics.pairwise import cosine_similarity

# Each row = user vector, columns = products
user_sim = cosine_similarity(user_item_matrix)
user_sim_df = pd.DataFrame(user_sim, index=user_item_matrix.index, columns=user_item_matrix.index)
from collections import Counter

def get_user_recommendations(target_user_id, top_n_users=3, top_n_products=5):
    if target_user_id not in user_sim_df.index:
        return []

    # Top similar users (exclude self)
    similar_users = user_sim_df[target_user_id].sort_values(ascending=False).iloc[1:top_n_users+1].index

    # Products already purchased by target user
    purchased = set(df[df['user_id'] == target_user_id]['product_id'])

    # Gather products from similar users
    recommendations = []
    for user in similar_users:
        products = set(df[df['user_id'] == user]['product_id'])
        recommendations.extend(list(products - purchased))

    # Return top N by frequency
    top_products = [pid for pid, _ in Counter(recommendations).most_common(top_n_products)]
    return top_products
sample_user = df['user_id'].iloc[0]
print(f"Recommendations for {sample_user}: {get_user_recommendations(sample_user)}")

user_ids = user_item_matrix.index

recommendation_docs = []
for uid in user_ids:
    recs = get_user_recommendations(uid)
    if recs:
        recommendation_docs.append({
            "user_id": uid,
            "recommended_products": recs
        })

# Use a separate collection for user-based recommendations
db.collaborative_filtering_recommendations.delete_many({})
if recommendation_docs:
    db.collaborative_filtering_recommendations.insert_many(recommendation_docs)
    print(f"Inserted recommendations for {len(recommendation_docs)} users")
