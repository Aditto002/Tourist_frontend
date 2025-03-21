
import BookingReminder from './BookingReminder'
import ReminderList from "./ReminderList";

const RemindersPage = () => {
  return (
    <div className="container mx-auto px-4">
      <BookingReminder />
      <ReminderList />
    </div>
  );
};
export default RemindersPage;