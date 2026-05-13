Role: You are a senior frontend developer specializing in building high-fidelity, data-driven interactive UIs using Tailwind CSS, React, and Lucide React.

Project: Seat Selection and Booking page for TicketRush, an event marketplace.

Target Design Reference: {{DATA:SCREEN:SCREEN_73}}

Style & Theme (The Electric Pulse):





Background: Deep dark theme (#0E0E15).



Primary Color: Electric Purple (#7C3AED) with gradients to Deep Blue (#2563EB).



Typography: 'Be Vietnam Pro'. Clean hierarchy with bold headlines and crisp labels.



Glassmorphism: Apply subtle glassmorphism (backdrop-blur-xl, semi-transparent overlays) on the sidebar and card containers.



Interactions: Use smooth transitions, neon glows for selected states, and subtle hover scales for interactive seats.

Data Structure Integration:
The UI must be designed to render seating zones dynamically based on an array of objects matching this schema:

interface SeatZone {
  name: string;
  price: number;
  totalRows: number;
  totalCols: number;
  colorHex: string; // Used for the seat's base color or glow
}

Layout Requirements:





Top Navigation Bar:





Fixed at the top with a backdrop-blur-xl background.



Left: "PULSE" logo with a vibrant violet-to-blue gradient.



Right: Minimalist "Help" icon.



Main Seat Selection Area (Center):





Stage Indicator: A subtle, wide "STAGE" marker at the top to orient the user.



Dynamic Seat Matrix: 





Render multiple zones (e.g., "ZONE VIP", "ZONE STANDARD") vertically.



Each zone's seats are arranged in a grid based on totalRows and totalCols.



Seat States:





Empty (Available): Bordered circle/square with low opacity.



Selected: Filled with the zone's colorHex and a strong neon glow.



Occupied (Sold out): Dark gray with a diagonal slash icon.



Interaction Controls: Floating "+" and "-" zoom buttons, plus a "Recenter" icon in the bottom right of the map area.



Legend: Minimalist icons at the bottom for "Trống" (Available), "Đã chọn" (Selected), and "Đã bán" (Sold).



Booking Summary Sidebar (Right):





Title: Event name (e.g., "NEON NIGHTS FESTIVAL 2024") and date/time.



Selected Seats List: A scrollable list of selected items showing Zone name, Row/Seat numbers, and price. Includes a "Remove" (X) icon for each.



Pricing Totals: 





Tạm tính (Subtotal)



Phí dịch vụ (Service fee)



Tổng cộng (Grand Total) in a large, bold Electric Purple font.



Primary Action: "Tiếp tục thanh toán" button with a vibrant neon violet-to-blue gradient.

Technical Stack Recommendations:





Framework: React



Styling: Tailwind CSS



Icons: Lucide React



Animations: Framer Motion (for smooth seat selection glows and sidebar list updates).

Key Visual Details:





Use #7C3AED as the default primary highlight.



Maintain high contrast and generous whitespace.



Ensure all seat matrix interactions feel snappy and performant.