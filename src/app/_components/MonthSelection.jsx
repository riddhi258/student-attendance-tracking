"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { CalendarDays } from "lucide-react";
import { addMonths } from "date-fns";
import moment from "moment";
import { Calendar } from "../../components/ui/calendar";

function MonthSelection({ selectedMonth }) {
  const today = new Date(); // Currently unused but keeping it for possible future use.
  const nextMonth = addMonths(today, 0); // Initializes the default to the current month.
  const [month, setMonth] = useState(nextMonth);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex gap-2 items-center text-slate-500"
          >
            <CalendarDays className="h-5 w-5" />
            {moment(month).format("MMM YYYY")}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            month={month}
            onMonthChange={(value) => {
              setMonth(value); // Updates the month state.
              selectedMonth(value); // Invokes the callback to pass the selected month.
            }}
            className="flex flex-1 justify-center"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MonthSelection;
