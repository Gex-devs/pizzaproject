from bson.objectid import ObjectId
import json

data = {
    "OrderItems": {
        "Item1": {
            "Item_id": "6427031a8ceafc25afd3477c",
            "Name": "Original Burger",
            "AmountOfOrder": 1
        },
        "Item2": {
            "Item_id": "6435399dc036c38d8a5d6276",
            "Name": "bacon cheese Burger",
            "AmountOfOrder": 1
        }
    }
}
print(type(data))
# Loop through each item in OrderItems and convert its Item_id field to an ObjectId
for item in data['OrderItems']:
    item_id = data['OrderItems'][item]['Item_id']
    data['OrderItems'][item]['Item_id'] = ObjectId(item_id)

# Print out the modified dictionary
print(json.dumps(data, default=str))