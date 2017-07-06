
import { DateFormatter } from "../util/date-formatter";

export class DatePipe {

    dateFormatter = new DateFormatter();

    transform(data, args) {
        this.dateFormatter.formatDate(new Date(), "yyyy/dd/MM");
    }
} 