"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { addMonths } from "date-fns";
import moment from "moment/moment";
import { Calendar } from "@/components/ui/calendar";

function MonthSelection({ selectedMonth }) {
  const today = new Date();

  const nextMonth = addMonths(new Date(), 0);
  const [month, setMonth] = useState(nextMonth);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline" // Corrected typo here (variant instead of varient)
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
              selectedMonth(value); // Call the callback to update selected month
              setMonth(value); // Update the month state
            }}
            className="flex flex-1 justify-center" // Corrected typo in the class name (felx -> flex)
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MonthSelection;
