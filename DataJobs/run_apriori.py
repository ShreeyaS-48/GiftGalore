import os
from dotenv import load_dotenv
from pymongo import MongoClient
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

load_dotenv()

MONGO_URI = os.environ.get("DB")
DB_NAME = "test"

MIN_SUPPORT = 0.02
MIN_CONFIDENCE = 0.4
TOP_K_PER_ANTECEDENT = 5

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

orders = list(db.orders.find({}, {"items": 1}))
transactions = []

for o in orders:
    order_items = []
    for item in o.get("items", []):
        product = item.get("product", {})
        if "_id" in product:
            order_items.append(str(product["_id"]))
    if order_items:
        transactions.append(order_items)

te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df = pd.DataFrame(te_ary, columns=te.columns_)

frequent_itemsets = apriori(df, min_support=MIN_SUPPORT, use_colnames=True)
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=MIN_CONFIDENCE)

docs = []
for _, r in rules.iterrows():
    lhs = list(r["antecedents"])
    rhs = list(r["consequents"])
    docs.append({
        "lhs": lhs,
        "rhs": rhs,
        "support": float(r["support"]),
        "confidence": float(r["confidence"]),
        "lift": float(r["lift"]),
    })

from collections import defaultdict
grouped = defaultdict(list)
for d in docs:
    key = tuple(d["lhs"])
    grouped[key].append(d)

final_docs = []
for key, group in grouped.items():
    group.sort(key=lambda x: x["confidence"], reverse=True)
    final_docs.extend(group[:TOP_K_PER_ANTECEDENT])

db.recommendations.delete_many({})           # clear older rules
if final_docs:
    db.recommendations.insert_many(final_docs)
    print(f"Inserted {len(final_docs)} rules into recommendations collection.")
else:
    print("No docs to insert.")