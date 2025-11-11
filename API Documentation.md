# API Documentation

## Authentication
- All admin endpoints require Supabase JWT authentication.
- Public endpoints are rate-limited and sanitized.

## Endpoints

### Bookings
- `POST /api/bookings` — Create a new booking (requires user auth)
- `GET /api/bookings` — List bookings (admin only)
- `PATCH /api/bookings/:id` — Update booking status (admin only)
- `DELETE /api/bookings/:id` — Cancel booking (admin only)

### Services
- `GET /api/services` — List all services
- `POST /api/services` — Add new service (admin only)
- `PATCH /api/services/:id` — Edit service (admin only)
- `DELETE /api/services/:id` — Remove service (admin only)

### Menu
- `GET /api/menu` — List menu items
- `POST /api/menu` — Add menu item (admin only)
- `PATCH /api/menu/:id` — Edit menu item (admin only)
- `DELETE /api/menu/:id` — Remove menu item (admin only)

### Shop
- `GET /api/shop` — List shop items
- `POST /api/shop` — Add shop item (admin only)
- `PATCH /api/shop/:id` — Edit shop item (admin only)
- `DELETE /api/shop/:id` — Remove shop item (admin only)

### Schedules
- `GET /api/schedules` — List weekly schedules
- `POST /api/schedules` — Add schedule (admin only)
- `PATCH /api/schedules/:id` — Edit schedule (admin only)
- `DELETE /api/schedules/:id` — Remove schedule (admin only)

### Media
- `POST /api/media/upload` — Upload image (admin only)
- `DELETE /api/media/:id` — Delete image (admin only)

### Messages
- `POST /api/messages` — Submit contact form or newsletter signup
- `GET /api/messages` — List messages (admin only)
