

\*\*Role:\*\* You are a senior frontend developer specializing in building high-fidelity, high-converting user interfaces using Tailwind CSS and React.



\*\*Project:\*\* Minimalist Waiting Room / Queue screen for TicketRush, an event marketplace.



\*\*Target Design Reference:\*\* {{DATA:SCREEN:SCREEN\_8}}



\*\*Style \& Theme (The Electric Pulse):\*\*

\- \*\*Background:\*\* Deep dark theme (#0E0E15).

\- \*\*Primary Color:\*\* Electric Purple (#7C3AED) with gradients to Deep Blue (#2563EB).

\- \*\*Typography:\*\* 'Be Vietnam Pro'. Clean hierarchy with bold headlines and crisp labels.

\- \*\*Glassmorphism:\*\* Apply heavy glassmorphism (backdrop-blur-2xl, semi-transparent overlays) on the central card.

\- \*\*Interactions:\*\* Use a smooth, animated gradient for the progress bar and a subtle pulse effect for the status icon.



\*\*Layout Requirements:\*\*



1\. \*\*Standalone Card (Centered):\*\*

&#x20;  - The entire UI should be a single, centered glassmorphic card on a dark, immersive background. No header or footer.

&#x20;  - \*\*Header Section:\*\*

&#x20;    - \*\*Status Icon:\*\* A circular icon with a glowing border and a "Hourglass" or "Pulse" symbol.

&#x20;    - \*\*Headline:\*\* "Bạn đang trong hàng chờ" (Large, bold, white).

&#x20;    - \*\*Subtext:\*\* "Chúng tôi đang giữ chỗ cho bạn. Trải nghiệm sự kiện bùng nổ sắp thuộc về bạn." (Gray text, centered).

&#x20;  - \*\*Queue Position Section:\*\*

&#x20;    - A dark, semi-transparent inner container (`bg-black/40`) with a subtle border.

&#x20;    - \*\*Label:\*\* "VỊ TRÍ TRONG HÀNG CHỜ" (Small, uppercase, gray).

&#x20;    - \*\*Position Number:\*\* "#452" (Extra-large, extra-bold, white with a strong violet glow effect).

&#x20;    - \*\*Wait Time:\*\* "Thời gian chờ dự kiến: \~12 phút" (Light gray with a clock icon).

&#x20;  - \*\*Progress Section:\*\*

&#x20;    - \*\*Labels:\*\* "TRONG HÀNG CHỜ" (Left) and "CHỌN VÉ" (Right) - Small, uppercase, gray labels.

&#x20;    - \*\*Progress Bar:\*\* A horizontal bar with a dark track. The filled portion (e.g., 60%) should be a vibrant violet-to-blue gradient with a subtle shimmer effect.

&#x20;  - \*\*Warning Section:\*\*

&#x20;    - A subtle, red-tinted alert box at the bottom of the card.

&#x20;    - \*\*Title:\*\* "Không tải lại trang" (Bold red).

&#x20;    - \*\*Content:\*\* "Làm mới hoặc đóng trang này sẽ khiến bạn mất lượt trong hàng chờ. Vui lòng giữ nguyên màn hình này." (Light gray text).



\*\*Technical Stack Recommendations:\*\*

\- \*\*Framework:\*\* React

\- \*\*Styling:\*\* Tailwind CSS

\- \*\*Icons:\*\* Lucide React (use `Hourglass`, `Clock`, `AlertCircle`).

\- \*\*Animations:\*\* Framer Motion (for a slow shimmer effect on the progress bar and a soft pulse on the queue number).



\*\*Key Visual Details:\*\*

\- Use #7C3AED for primary highlights.

\- Maintain a high-end "Midnight Pulse" aesthetic with generous blur and subtle neon accents.

\- Ensure the card has a deep shadow and outer glow to separate it from the pitch-black background.



