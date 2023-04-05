from pymongo import MongoClient


client = MongoClient("mongodb+srv://test:test123@cluster0.kebg03f.mongodb.net/?retryWrites=true&w=majority")

database = client['PizzaProject']

OrderCol = database['Orders']


OrderCol.insert_one({'New_data':'Datafound'})