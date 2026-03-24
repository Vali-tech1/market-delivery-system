# Class Diagram (UML)

## Product
- id (private)
- name (private)
- price (private)
- stock (private)

+ isAvailable() (public)

---

## Category
- id (private)
- name (private)

---

## User
- id (private)
- fullName (private)
- email (private)
- role (private)

+ isAdmin() (public)

---

## Order
- id (private)
- userId (private)
- status (private)
- items (private)

+ calculateTotal() (public)

---

## OrderItem
- productId (private)
- quantity (private)
- unitPrice (private)

+ getSubtotal() (public)

---

## DailyOffer
- productId (private)
- discountPercentage (private)
- startDate (private)
- endDate (private)

+ isActive() (public)

---

## Invoice
- id (private)
- orderId (private)
- totalAmount (private)

---

## IRepository
+ getAll()
+ getById(id)
+ add(item)
+ save()

---

## FileRepository
Implements IRepository

---

## Relationships
- Order → contains → OrderItem
- OrderItem → references → Product
- Product → belongs to → Category
- Invoice → generated from → Order