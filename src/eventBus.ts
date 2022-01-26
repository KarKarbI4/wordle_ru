import { createNanoEvents } from "nanoevents";

interface EventBusEvents {
  syntheticinput: (key: string) => void;
}

export const eventBus = createNanoEvents<EventBusEvents>();
