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


def update_oid(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, dict):
                update_oid(value)
            elif key == "$oid":
                data[key] = ObjectId(value)
    return data

def addTopendingOrder(data, pendingOrderCol:Collection):
    data = update_oid(data)
    data = json.loads(data)
    pendingOrderCol.insert_one(data)
    return data
