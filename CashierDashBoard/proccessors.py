from datetime import datetime
from bson import ObjectId
import json
from pymongo.collection import Collection



def CreateBucketUpdate(ID:str,foodMenuCol:Collection):

    Data = foodMenuCol.find_one(ObjectId(ID))

    print(Data)
    return 0