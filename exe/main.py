from pprint import pprint
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import sys

client = MongoClient("mongodb://localhost:27017/")

db = client['food-flock']

orderedmeals = db['orderedmeals'].find({})
df1_i = []
for orderedmeal in orderedmeals:
    df1_i.append(
        {'meal': str(orderedmeal['meal']), 'order': str(orderedmeal['order'])})
df1 = pd.DataFrame(df1_i)

orders = db['orders'].find({})
df2_i = []
for order in orders:
    df2_i.append(
        {'_id': str(order['_id']), 'rating': order.get('rating', 0),
            'userId': str(order['userId'])}
    )

df2 = pd.DataFrame(df2_i)

df = pd.merge(df1, df2, "inner", left_on="order", right_on="_id")
df = df[['userId', 'rating', 'meal']]

mean = df.groupby(by=['userId', 'meal']).rating.mean().reset_index()
mean.to_csv("out.csv", index=False)

table = mean.pivot(index='userId', columns='meal', values='rating')
user_item_matrix = np.nan_to_num(table)

item_similarity = cosine_similarity(user_item_matrix.T)

user = sys.argv[1]
# list index of table
user_index = table.index.tolist().index(user)
interactions = np.nan_to_num(table.iloc[user_index])

user_interactions = interactions
item_scores = user_interactions.dot(item_similarity)
recommended_items = np.argsort(item_scores)[::-1][:-1]
for item in recommended_items:
    # get table column names
    column_names = table.columns
    # get table column values
    print(column_names[item], flush=True)
