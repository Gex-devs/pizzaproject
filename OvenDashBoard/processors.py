from datetime import datetime
from bson import ObjectId
import json
from pymongo.collection import Collection

def CreatOrderForFront_end(event, mongodbCol:Collection) -> str:
    time = datetime.now()
    # Get the Item_id and AmountOfOrder fields from the event's fullDocument
    order_items = event['fullDocument']['OrderItems']
    item_ids = []
    amounts = []
    item_names = []
    item_prices = []
    orderID = event['documentKey']['_id']

    for item in order_items.values():
        item_ids.append(item['Item_id'])
        amounts.append(item['AmountOfOrder'])
        itemsDetail = mongodbCol.find_one(item['Item_id'])
        item_names.append(itemsDetail['name'])
        item_prices.append(itemsDetail['price'])

    order_items = {}

    for i, (item_id, amount) in enumerate(zip(item_ids, amounts)):
        # Get the item name and price from the corresponding lists
        item_name = item_names[i]
        item_price = item_prices[i]
        # Create a dictionary representing the item and its amount
        item = {'Item_id': str(item_id), 'Item_name': item_name,
                'AmountOfOrder': amount, 'Price': item_price}
        # Add the dictionary to the order items dictionary with the item ID as the key
        order_items['Item{}'.format(i + 1)] = item
        order = {'Order_id': str(orderID), "logTime": str(
            time), 'OrderItems': order_items}
    
    status = event['fullDocument'].get('Status')
    if status is not None:
        order.update({'Status':status})

    order_json = json.dumps(order)
    print(order_json)

    return order_json


def CreatStartOrder(OrderId, MongodbColpendingOrder:Collection,MongodbColFoodMenu:Collection) -> str:

    Order = MongodbColpendingOrder.find_one(ObjectId(OrderId))
    order_items = {}

# Loop through the OrderItems dictionary and append each item to the order_items dictionary
    for item_name, item_info in Order["OrderItems"].items():
        print(item_info['Item_id'])
    
        tt = MongodbColFoodMenu.find_one(ObjectId(item_info['Item_id']))
        item = {'Item_id': str(item_info['Item_id']), 'Item_name': tt['name'],
                'AmountOfOrder': item_info['AmountOfOrder'], 'Price': tt['price']}
        order_items[item_name] = item

    # Create the order dictionary with the order ID, logTime, and order items
    order = {'Order_id': str(Order['_id']),'OrderItems': order_items,
             'logTime': str(datetime.now())}

    # Convert the order dictionary to a JSON string and print it
    order_json = json.dumps(order)
    print(order_json)

    
    return order_json


def UpdateHistory(OrderID:str, OrderState:str,MongodbColpendingOrder:Collection,MongodbColHistory:Collection):

    Update = MongodbColpendingOrder.find_one(ObjectId(OrderID))

    Update['Status'] = "completed" if OrderState == "true" else "canceled"
    MongodbColHistory.insert_one(Update)
    MongodbColpendingOrder.delete_one({'_id': Update['_id']})
    print("Deleted Object")
  