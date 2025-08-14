/* eslint-disable no-unused-vars */
export default function splitDateTime(input) {
    if (!input || typeof input !== 'string' || !input.includes('T')) {
        return { date: '', time: '' }; // أو يمكنك إرجاع null أو رسالة خطأ
    }

    try {
        const [date, timePart] = input.split('T');
        let [hour, minute] = timePart.split(':');

        hour = parseInt(hour, 10);
        minute = parseInt(minute, 10);

        if (isNaN(hour) || isNaN(minute)) {
            return { date: '', time: '' };
        }

        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;

        return {
            date,
            time: `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`
        };
    } catch (error) {
        return { date: '', time: '' };
    }
}
