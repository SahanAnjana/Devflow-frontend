# CRM Service API Documentation

## Overview
This API provides comprehensive endpoints for managing CRM operations including companies, contacts, deals, contracts, and proposals.

## Authentication
All endpoints require authentication. Two types of authentication are supported:
- CRM User (Basic access)
- Admin User (Full access)

Authentication headers must be included in all requests:
```
Authorization: Bearer <token>
```

## Companies API

### Create Company
**POST /companies/**

Create a new company.

**Request Body**
```json
{
    "name": "string",
    "industry": "string",
    "website": "string",
    "phone": "string",
    "email": "string",
    "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "postalCode": "string",
        "country": "string"
    }
}
```

**Response**
```json
{
    "success": true,
    "data": {
        "id": "string",
        "name": "string",
        "industry": "string",
        "website": "string",
        "phone": "string",
        "email": "string",
        "address": {
            "street": "string",
            "city": "string",
            "state": "string",
            "postalCode": "string",
            "country": "string"
        },
        "created_by": "string",
        "created_at": "string",
        "updated_at": "string"
    }
}
```

### Get Companies
**GET /companies/**

Retrieve a list of companies with optional filtering.

**Query Parameters**
- `skip`: integer (default: 0) - Number of companies to skip
- `limit`: integer (default: 20, max: 100) - Number of companies to return
- `search`: string (optional) - Search term to filter companies
- `industry`: string (optional) - Filter by industry

**Response**
```json
{
    "success": true,
    "data": [Company[]],
    "pagination": {
        "totalItems": number,
        "currentPage": number,
        "itemsPerPage": number
    }
}
```

### Get Company by ID
**GET /companies/{company_id}**

Retrieve a specific company by its ID.

**Response**
```json
{
    "success": true,
    "data": Company
}
```

### Update Company
**PUT /companies/{company_id}**

Update an existing company.

**Request Body**
```json
{
    "name": "string",
    "industry": "string",
    "website": "string",
    "phone": "string",
    "email": "string",
    "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "postalCode": "string",
        "country": "string"
    }
}
```

### Delete Company
**DELETE /companies/{company_id}**

Delete a company (Admin only).

## Contacts API

### Create Contact
**POST /contacts/**

Create a new contact.

**Request Body**
```json
{
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "companyId": "string",
    "tags": ["string"],
    "position": "string",
    "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "postalCode": "string",
        "country": "string"
    }
}
```

**Response**
```json
{
    "success": true,
    "data": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phone": "string",
        "companyId": "string",
        "tags": ["string"],
        "position": "string",
        "address": {
            "street": "string",
            "city": "string",
            "state": "string",
            "postalCode": "string",
            "country": "string"
        },
        "created_by": "string",
        "created_at": "string",
        "updated_at": "string"
    }
}
```

### Get Contacts
**GET /contacts/**

Retrieve a list of contacts with optional filtering.

**Query Parameters**
- `skip`: integer (default: 0) - Number of contacts to skip
- `limit`: integer (default: 20, max: 100) - Number of contacts to return
- `search`: string (optional) - Search term to filter contacts
- `companyId`: string (optional) - Filter by company ID
- `tags`: array[string] (optional) - Filter by tags

**Response**
```json
{
    "success": true,
    "data": [Contact[]],
    "pagination": {
        "totalItems": number,
        "currentPage": number,
        "itemsPerPage": number
    }
}
```

### Get Contact by ID
**GET /contacts/{contact_id}**

Retrieve a specific contact by its ID.

**Response**
```json
{
    "success": true,
    "data": Contact
}
```

### Update Contact
**PUT /contacts/{contact_id}**

Update an existing contact.

**Request Body**
```json
{
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "companyId": "string",
    "tags": ["string"],
    "position": "string",
    "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "postalCode": "string",
        "country": "string"
    }
}
```

### Delete Contact
**DELETE /contacts/{contact_id}**

Delete a contact (Admin only).

## Deals API

### Create Deal
**POST /deals/**

Create a new deal.

**Request Body**
```json
{
    "title": "string",
    "companyId": "string",
    "contactId": "string",
    "description": "string",
    "value": number,
    "stage": "string",
    "closeDate": "string" (ISO 8601),
    "probability": number,
    "source": "string",
    "type": "string",
    "tags": ["string"]
}
```

**Response**
```json
{
    "success": true,
    "data": {
        "id": "string",
        "title": "string",
        "companyId": "string",
        "contactId": "string",
        "description": "string",
        "value": number,
        "stage": "string",
        "closeDate": "string",
        "probability": number,
        "source": "string",
        "type": "string",
        "tags": ["string"],
        "created_by": "string",
        "created_at": "string",
        "updated_at": "string"
    }
}
```

### Get Deals
**GET /deals/**

Retrieve a list of deals with optional filtering.

**Query Parameters**
- `skip`: integer (default: 0) - Number of deals to skip
- `limit`: integer (default: 20, max: 100) - Number of deals to return
- `search`: string (optional) - Search term to filter deals
- `companyId`: string (optional) - Filter by company ID
- `contactId`: string (optional) - Filter by contact ID
- `stage`: string (optional) - Filter by deal stage
- `status`: string (optional) - Filter by deal status
- `tags`: array[string] (optional) - Filter by tags

**Response**
```json
{
    "success": true,
    "data": [Deal[]],
    "pagination": {
        "totalItems": number,
        "currentPage": number,
        "itemsPerPage": number
    }
}
```

### Get Deal by ID
**GET /deals/{deal_id}**

Retrieve a specific deal by its ID.

**Response**
```json
{
    "success": true,
    "data": Deal
}
```

### Update Deal
**PUT /deals/{deal_id}**

Update an existing deal.

**Request Body**
```json
{
    "title": "string",
    "description": "string",
    "value": number,
    "stage": "string",
    "closeDate": "string",
    "probability": number,
    "source": "string",
    "type": "string",
    "tags": ["string"]
}
```

### Update Deal Status
**PATCH /deals/{deal_id}/status**

Update the status of a deal.

**Request Body**
```json
{
    "status": "string" (open, won, lost, abandoned)
}
```

### Delete Deal
**DELETE /deals/{deal_id}**

Delete a deal (Admin only).

## Activities API

### Create Activity
**POST /activities/**

Create a new activity.

**Request Body**
```json
{
    "type": "string",
    "subject": "string",
    "description": "string",
    "dueDate": "string" (ISO 8601),
    "priority": "string",
    "status": "string",
    "assignedTo": "string",
    "dealId": "string",
    "contactId": "string"
}
```

**Response**
```json
{
    "success": true,
    "data": {
        "id": "string",
        "type": "string",
        "subject": "string",
        "description": "string",
        "dueDate": "string",
        "priority": "string",
        "status": "string",
        "assignedTo": "string",
        "dealId": "string",
        "contactId": "string",
        "created_by": "string",
        "created_at": "string",
        "updated_at": "string"
    }
}
```

### Get Activities
**GET /activities/**

Retrieve a list of activities with optional filtering.

**Query Parameters**
- `skip`: integer (default: 0) - Number of activities to skip
- `limit`: integer (default: 20, max: 100) - Number of activities to return
- `search": string (optional) - Search term to filter activities
- `type": string (optional) - Filter by activity type
- `status": string (optional) - Filter by activity status
- `priority": string (optional) - Filter by priority
- `assignedTo": string (optional) - Filter by assigned user
- `dealId": string (optional) - Filter by deal ID
- `contactId": string (optional) - Filter by contact ID

**Response**
```json
{
    "success": true,
    "data": [Activity[]],
    "pagination": {
        "totalItems": number,
        "currentPage": number,
        "itemsPerPage": number
    }
}
```

### Get Activity by ID
**GET /activities/{activity_id}**

Retrieve a specific activity by its ID.

**Response**
```json
{
    "success": true,
    "data": Activity
}
```

### Update Activity
**PUT /activities/{activity_id}**

Update an existing activity.

**Request Body**
```json
{
    "type": "string",
    "subject": "string",
    "description": "string",
    "dueDate": "string",
    "priority": "string",
    "status": "string",
    "assignedTo": "string"
}
```

### Update Activity Status
**PATCH /activities/{activity_id}/status**

Update the status of an activity.

**Request Body**
```json
{
    "status": "string" (pending, completed, cancelled)
}
```

### Delete Activity
**DELETE /activities/{activity_id}**

Delete an activity (Admin only).

## Communications API

### Create Communication
**POST /communications/**

Create a new communication record.

**Request Body**
```json
{
    "type": "string",
    "subject": "string",
    "content": "string",
    "date": "string" (ISO 8601),
    "dealId": "string",
    "contactId": "string",
    "attachments": ["string"]
}
```

**Response**
```json
{
    "success": true,
    "data": {
        "id": "string",
        "type": "string",
        "subject": "string",
        "content": "string",
        "date": "string",
        "dealId": "string",
        "contactId": "string",
        "attachments": ["string"],
        "created_by": "string",
        "created_at": "string"
    }
}
```

### Get Communications
**GET /communications/**

Retrieve a list of communications with optional filtering.

**Query Parameters**
- `skip": integer (default: 0) - Number of communications to skip
- `limit": integer (default: 20, max: 100) - Number of communications to return
- `search": string (optional) - Search term to filter communications
- `type": string (optional) - Filter by communication type
- `dealId": string (optional) - Filter by deal ID
- `contactId": string (optional) - Filter by contact ID
- `dateRange": string (optional) - Filter by date range

**Response**
```json
{
    "success": true,
    "data": [Communication[]],
    "pagination": {
        "totalItems": number,
        "currentPage": number,
        "itemsPerPage": number
    }
}
```

### Get Communication by ID
**GET /communications/{communication_id}**

Retrieve a specific communication by its ID.

**Response**
```json
{
    "success": true,
    "data": Communication
}
```

### Delete Communication
**DELETE /communications/{communication_id}**

Delete a communication (Admin only).

## Error Responses
All endpoints may return the following error responses:

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Invalid or missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found

## Status Codes

### Deal Statuses
- open
- won
- lost
- abandoned

### Activity Statuses
- pending
- completed
- cancelled

### Contract Statuses
- draft
- pending_approval
- approved
- signed
- expired
- cancelled

### Proposal Statuses
- draft
- sent
- accepted
- rejected
- expired

## Notes
1. All dates should be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
2. Only admin users can delete records
3. Users can only access and modify their own records unless they are admin
4. Pagination is supported with skip/limit parameters
5. All endpoints return a standard response format with `success` and `data` fields
6. All endpoints support filtering with query parameters

## Error Responses
All endpoints may return the following error responses:

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Invalid or missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found

## Status Codes

### Contract Statuses
- draft
- pending_approval
- approved
- signed
- expired
- cancelled

### Proposal Statuses
- draft
- sent
- accepted
- rejected
- expired

## Notes
1. All dates should be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
2. Only admin users can delete contracts and proposals
3. Users can only access and modify their own contracts/proposals unless they are admin
4. Pagination is supported with skip/limit parameters
5. All endpoints return a standard response format with `success` and `data` fields
