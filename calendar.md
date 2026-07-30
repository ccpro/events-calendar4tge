# Calendar view plan

## Goal
Display scheduled events on a calendar so an organizer can quickly see what is happening on a given day.

## Recommended approach
Use a lightweight calendar library for the month grid and a day-list panel for the selected day. This keeps the implementation simple while still giving a clear organizer view.

## Implementation plan
1. Add a calendar view to the events page (in progress)
   - Show a month grid with the current month by default.
   - Highlight days that have one or more scheduled events.
   - Allow clicking a day to show that day's event list.

2. Fetch events for the visible range
   - Add a small API helper to load events between a start and end date.
   - Reuse the existing events data model instead of creating a separate calendar-only source.

3. Render events in the calendar
   - Each event should show a compact label such as the event name and start time.
   - If the day is overloaded, show a count badge and let the organizer expand the day view.

4. Add a day agenda panel
   - When a day is selected, display all events for that day in chronological order.
   - Include a link or button to open the full event details view.

5. Keep the UX simple and consistent
   - Use the existing app styling patterns.
   - Avoid introducing a large dependency unless it clearly improves the UI.

## Suggested library
- Option A: react-big-calendar for a full calendar experience.
- Option B: react-calendar plus a simple list panel if a lighter-weight implementation is preferred.

## Acceptance criteria
- Organizer can switch months.
- Days with events are visually marked.
- Selecting a day shows the events scheduled for that day.
- Existing event data is reused without a separate data store.

## Scope notes
- This plan focuses on the calendar view and day-by-day event display.
- Event creation, registration, and invite export remain unchanged for this step.
