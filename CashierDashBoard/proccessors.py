from datetime import datetime
from bson import ObjectId
import json
from pymongo.collection import Collection



def CreateBucketUpdate(ID:str,AmountOfOrder,foodMenuCol:Collection):

    Data = foodMenuCol.find_one(ObjectId(ID))

    AmountOfOrder = int(AmountOfOrder)

    
    Data['TotalAmount'] = AmountOfOrder
    Data['TotalPrice'] = Data['price'] * AmountOfOrder
    Data['_id'] = str(Data['_id'])

    print(Data)
    

    return Data



def addTopendingOrder(data, pendingOrderCol:Collection):
    data = json.loads(data)

    ## Changing the string ID to Object ID for mongodb
    for item in data['OrderItems']:
        item_id = data['OrderItems'][item]['Item_id']
        data['OrderItems'][item]['Item_id'] = ObjectId(item_id)
    print(json.dumps(data, default=str))
    pendingOrderCol.insert_one(data)

