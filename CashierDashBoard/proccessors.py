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