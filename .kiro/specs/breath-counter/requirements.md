# Requirements Document

## Introduction

This feature adds a visual counter to the existing breath timer sine wave application. The counter will display the current breathing cycle count, incrementing from 0 to 21 and then resetting back to 0. The counter will be synchronized with the sine wave animation, advancing by one count each time the sine wave completes a full cycle. This provides users with a way to track their breathing exercises and maintain awareness of their progress through a structured breathing session.

## Requirements

### Requirement 1

**User Story:** As a user practicing breathing exercises, I want to see a counter that tracks my breathing cycles, so that I can monitor my progress and maintain focus during my session.

#### Acceptance Criteria

1. WHEN the application starts THEN the counter SHALL display "0"
2. WHEN a complete sine wave cycle finishes THEN the counter SHALL increment by 1
3. WHEN the counter reaches 21 THEN the counter SHALL reset to 0 on the next cycle
4. WHEN the sine wave animation is paused THEN the counter SHALL not increment
5. WHEN the sine wave animation resumes THEN the counter SHALL continue incrementing from its current value

### Requirement 2

**User Story:** As a user, I want the counter to be clearly visible and non-intrusive on both desktop and mobile devices, so that I can see my progress without it interfering with the breathing visualization.

#### Acceptance Criteria

1. WHEN the counter is displayed THEN it SHALL be positioned in a location that does not obstruct the sine wave visualization
2. WHEN the counter updates THEN it SHALL use clear, readable typography that is easily distinguishable from the sine wave
3. WHEN the counter changes value THEN the transition SHALL be smooth and not jarring
4. WHEN viewing on mobile devices THEN the counter SHALL remain visible and properly positioned with appropriate touch-friendly sizing
5. WHEN viewing on different screen sizes THEN the counter SHALL scale appropriately and maintain readability
6. WHEN displayed on mobile THEN the counter SHALL have sufficient contrast and spacing to be clearly distinguished from the sine wave background

### Requirement 3

**User Story:** As a user, I want the counter to accurately reflect the breathing cycle timing, so that I can trust it as a reliable guide for my breathing practice.

#### Acceptance Criteria

1. WHEN the sine wave completes exactly one full period THEN the counter SHALL increment exactly once
2. WHEN the animation speed is adjusted THEN the counter increment timing SHALL adjust accordingly
3. WHEN the sine wave amplitude is changed THEN the counter timing SHALL remain based on the wave period, not amplitude
4. IF the animation is reset or restarted THEN the counter SHALL reset to 0

### Requirement 4

**User Story:** As a user, I want the counter to integrate seamlessly with the existing controls, so that the breathing timer remains intuitive and easy to use.

#### Acceptance Criteria

1. WHEN existing controls (amplitude, speed sliders) are used THEN the counter SHALL continue to function correctly
2. WHEN the counter is added THEN existing functionality SHALL remain unchanged
3. WHEN the counter resets to 0 THEN it SHALL not interfere with the sine wave animation
4. IF there are any control interactions THEN the counter SHALL respond appropriately to maintain synchronization

### Requirement 5

**User Story:** As a mobile user, I want the counter and breathing visualization to work seamlessly on touch devices, so that I can practice breathing exercises effectively on my phone or tablet.

#### Acceptance Criteria

1. WHEN using the app on mobile devices THEN the counter SHALL be clearly visible without requiring zooming
2. WHEN the device orientation changes THEN the counter SHALL remain properly positioned and readable
3. WHEN using touch interactions with existing controls THEN the counter SHALL maintain synchronization
4. WHEN the counter text overlays or is near the canvas THEN it SHALL have sufficient contrast and visual separation to be easily readable
5. IF the mobile viewport is small THEN the counter SHALL be positioned to maximize both counter visibility and sine wave viewing area