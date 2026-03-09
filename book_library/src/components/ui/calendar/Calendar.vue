<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import {
  CalendarRoot,
  type CalendarRootEmits,
  type CalendarRootProps,
  useForwardPropsEmits,
} from "reka-ui";
import type { DateValue } from "@internationalized/date";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<
  CalendarRootProps & {
    class?: HTMLAttributes["class"];
    placeholder?: DateValue;
  }
>();
const emits = defineEmits<
  CalendarRootEmits & {
    "update:placeholder": [value: DateValue];
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

function formatMonth(date: any) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date.toDate("UTC"));
}
</script>

<template>
  <CalendarRoot
    v-slot="{ grid, weekDays }"
    :class="
      cn(
        'p-3 bg-[#101922] text-slate-100 rounded-md border border-slate-700',
        props.class,
      )
    "
    v-bind="forwarded"
  >
    <div class="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div
        v-for="month in grid"
        :key="month.value.toString()"
        class="space-y-4"
      >
        <div class="relative flex items-center justify-between pt-1 px-2">
          <div class="text-sm font-medium">
            {{ formatMonth(month.value) }}
          </div>
          <div class="flex items-center space-x-1">
            <button
              type="button"
              class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-slate-700 text-white"
              @click="
                emits('update:placeholder', month.value.subtract({ years: 1 }))
              "
            >
              <ChevronLeft class="h-4 w-4" style="margin-right: -4px" />
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-slate-700 text-white"
              @click="
                emits('update:placeholder', month.value.subtract({ months: 1 }))
              "
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-slate-700 text-white"
              @click="
                emits('update:placeholder', month.value.add({ months: 1 }))
              "
            >
              <ChevronRight class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-slate-700 text-white"
              @click="
                emits('update:placeholder', month.value.add({ years: 1 }))
              "
            >
              <ChevronRight class="h-4 w-4" />
              <ChevronRight class="h-4 w-4" style="margin-left: -4px" />
            </button>
          </div>
        </div>
        <table class="w-full border-collapse space-y-1">
          <thead>
            <tr class="flex">
              <th
                v-for="day in weekDays"
                :key="day"
                class="w-9 rounded-md text-[0.8rem] font-normal text-slate-400"
              >
                {{ day.slice(0, 2) }}
              </th>
            </tr>
          </thead>
          <tbody class="space-y-2">
            <tr
              v-for="(week, index) in month.rows"
              :key="`week-${index}`"
              class="mt-2 flex w-full"
            >
              <td
                v-for="day in week"
                :key="day.toString()"
                class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:bg-slate-800 first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md"
              >
                <button
                  type="button"
                  :class="
                    cn(
                      'h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-800 transition-colors',
                      day.month !== month.value.month &&
                        'text-slate-500 opacity-50',
                      'data-[selected]:bg-brand-primary data-[selected]:text-white data-[selected]:hover:bg-brand-primary-hover data-[selected]:opacity-100',
                      'data-[today]:bg-slate-800 data-[today]:text-white',
                    )
                  "
                  :data-selected="
                    day.toString() === forwarded.modelValue?.toString()
                      ? ''
                      : undefined
                  "
                  :data-today="
                    day.toString() === new Date().toISOString().split('T')[0]
                      ? ''
                      : undefined
                  "
                  @click="forwarded['onUpdate:modelValue']?.(day)"
                >
                  {{ day.day }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </CalendarRoot>
</template>
