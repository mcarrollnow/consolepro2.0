# Simple B2B Order API Integration

## Overview
External applications can submit orders to our B2B system using the same API endpoint as our web form. Orders will be automatically processed through our complete pipeline including Google Sheets integration, Wix order creation, inventory checking, and email notifications.

## API Endpoint
```
POST https://myconsole.pro/api/send-request
```

## Authentication
No authentication required - this uses the same public endpoint as our web form.

## Request Format

### Required Fields
```json
{
  "name": "Customer Name",
  "email": "customer@email.com",
  "billingAddress": "123 Main St",
  "billingCity": "City Name",
  "billingState": "State",
  "billingZip": "12345",
  "items": [
    {
      "item": "Product Name",
      "qty": "2",
      "price": 25.99
    }
  ]
}
```

### Complete Example with All Optional Fields
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "company": "Acme Corporation",
  "phone": "555-123-4567",
  "billingAddress": "123 Main Street",
  "billingAddress2": "Suite 100",
  "billingCity": "New York",
  "billingState": "NY",
  "billingZip": "10001",
  "shippingRecipient": "Jane Smith",
  "shippingAddress": "456 Oak Avenue",
  "shippingAddress2": "Unit B",
  "shippingCity": "Boston",
  "shippingState": "MA",
  "shippingZip": "02101",
  "shipToDifferent": true,
  "referredBy": "Sales Rep Name",
  "special": "Handle with care - fragile items",
  "discountCode": "SAVE10",
  "items": [
    {
      "item": "Widget Pro",
      "qty": "2",
      "price": 25.99
    },
    {
      "item": "Gadget Plus",
      "qty": "1",
      "price": 15.50
    },
    {
      "item": "Tool Set",
      "qty": "3",
      "price": 45.00
    }
  ]
}
```

## Field Descriptions

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Customer's full name |
| `email` | string | Customer's email address |
| `billingAddress` | string | Billing street address |
| `billingCity` | string | Billing city |
| `billingState` | string | Billing state/province |
| `billingZip` | string | Billing postal code |
| `items` | array | Array of product items (minimum 1 item) |

### Item Object Structure
| Field | Type | Description |
|-------|------|-------------|
| `item` | string | Product name |
| `qty` | string | Quantity (as string) |
| `price` | number | Unit price |

### Optional Fields
| Field | Type | Description |
|-------|------|-------------|
| `company` | string | Business/company name |
| `phone` | string | Customer phone number |
| `billingAddress2` | string | Billing address line 2 (suite, unit, etc.) |
| `shippingRecipient` | string | Name of shipping recipient |
| `shippingAddress` | string | Shipping street address |
| `shippingAddress2` | string | Shipping address line 2 |
| `shippingCity` | string | Shipping city |
| `shippingState` | string | Shipping state/province |
| `shippingZip` | string | Shipping postal code |
| `shipToDifferent` | boolean | Set to `true` if shipping differs from billing |
| `referredBy` | string | Sales representative name |
| `special` | string | Special instructions or notes |
| `discountCode` | string | Discount code to apply |

## Response Format

### Success Response
```json
{
  "ok": true,
  "orderCode": "B2B-0710-ABC1-1"
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

## What Happens After Order Submission

1. **Order Code Generation**: Unique B2B order code assigned (format: B2B-MMDD-XXXX-1)
2. **Discount Processing**: Discount codes validated and applied if provided
3. **Inventory Validation**: Stock levels checked against requested quantities
4. **Customer Management**: Customer created or updated in system
5. **Google Sheets Integration**: Order recorded in Google Sheets
6. **Wix Integration**: Customer and order created in Wix system
7. **Email Notifications**: 
   - Internal notification sent to sales team
   - Customer confirmation email sent
8. **Inventory Recording**: Sales recorded in inventory system

## Example Code

### JavaScript/Node.js
```javascript
const submitOrder = async (orderData) => {
  try {
    const response = await fetch('https://myconsole.pro/api/send-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('Order submitted successfully:', result.orderCode);
      return result.orderCode;
    } else {
      console.error('Order submission failed:', result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

// Example usage
const orderData = {
  name: "John Doe",
  email: "john@company.com",
  billingAddress: "123 Main St",
  billingCity: "New York",
  billingState: "NY",
  billingZip: "10001",
  items: [
    {
      item: "Widget Pro",
      qty: "2",
      price: 25.99
    }
  ]
};

submitOrder(orderData)
  .then(orderCode => console.log('Success:', orderCode))
  .catch(error => console.error('Error:', error));
```

### Python
```python
import requests
import json

def submit_order(order_data):
    url = 'https://myconsole.pro/api/send-request'
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, json=order_data, headers=headers)
        result = response.json()
        
        if result.get('ok'):
            print(f"Order submitted successfully: {result['orderCode']}")
            return result['orderCode']
        else:
            print(f"Order submission failed: {result.get('error')}")
            raise Exception(result.get('error'))
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        raise

# Example usage
order_data = {
    "name": "John Doe",
    "email": "john@company.com",
    "billingAddress": "123 Main St",
    "billingCity": "New York", 
    "billingState": "NY",
    "billingZip": "10001",
    "items": [
        {
            "item": "Widget Pro",
            "qty": "2",
            "price": 25.99
        }
    ]
}

try:
    order_code = submit_order(order_data)
    print(f"Success: {order_code}")
except Exception as e:
    print(f"Error: {e}")
```

### cURL
```bash
curl -X POST https://myconsole.pro/api/send-request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@company.com",
    "billingAddress": "123 Main St",
    "billingCity": "New York",
    "billingState": "NY", 
    "billingZip": "10001",
    "items": [
      {
        "item": "Widget Pro",
        "qty": "2",
        "price": 25.99
      }
    ]
  }'
```

## Testing

### Test with Minimal Data
```json
{
  "name": "Test Customer",
  "email": "test@example.com",
  "billingAddress": "123 Test Street",
  "billingCity": "Test City",
  "billingState": "TX",
  "billingZip": "12345",
  "items": [
    {
      "item": "Test Product",
      "qty": "1", 
      "price": 10.00
    }
  ]
}
```

### Test with Full Data
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "company": "Test Company Inc",
  "phone": "555-123-4567",
  "billingAddress": "123 Test Street",
  "billingAddress2": "Suite 200",
  "billingCity": "Test City",
  "billingState": "CA",
  "billingZip": "90210",
  "shippingRecipient": "Shipping Recipient",
  "shippingAddress": "456 Shipping Avenue",
  "shippingAddress2": "Building A",
  "shippingCity": "Ship City", 
  "shippingState": "NY",
  "shippingZip": "10001",
  "shipToDifferent": true,
  "referredBy": "Test Sales Rep",
  "special": "This is a test order",
  "discountCode": "TEST10",
  "items": [
    {
      "item": "Test Product A",
      "qty": "2",
      "price": 15.99
    },
    {
      "item": "Test Product B", 
      "qty": "1",
      "price": 25.50
    }
  ]
}
```

## Error Handling

Common error scenarios to handle:

- **Missing required fields**: Ensure all required fields are provided
- **Invalid email format**: Validate email format before sending
- **Empty items array**: Include at least one item in the order
- **Network errors**: Implement retry logic for network failures
- **Server errors (500)**: Log errors and retry if appropriate

## Rate Limiting

No specific rate limits are currently enforced, but please be reasonable with request frequency to avoid overwhelming the system.

## Support

For integration support or questions, contact: admin@vanguardhalo.com

## Notes

- **Address Line 2**: Both `billingAddress2` and `shippingAddress2` are supported for apartment numbers, suite numbers, etc.
- **Shipping Address**: If shipping fields are not provided, billing address will be used for shipping
- **Order Codes**: Generated automatically in format B2B-MMDD-XXXX-1 where MMDD is month/day and XXXX is random
- **Inventory**: System will validate product availability and update stock levels
- **Emails**: Both internal notifications and customer confirmations are sent automatically
- **Wix Integration**: Orders automatically create customers and orders in Wix system for payment processing 