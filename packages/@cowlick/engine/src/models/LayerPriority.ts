import {PriorityQueue} from "./PriorityQueue";
import {LayerKind} from "@cowlick/core";

export class LayerPriority {
  private priorities: Map<string, number>;
  private minPriority: number;
  private layers: string[];

  constructor(priorities: Map<string, number>) {
    this.priorities = priorities;
    this.minPriority = -1;
    for (const v of this.priorities.values()) {
      this.minPriority = Math.min(this.minPriority, v);
    }
    this.layers = [];
  }

  add(name: string) {
    if (name === LayerKind.backlog) {
      return;
    }
    this.layers = this.layers.filter(n => n !== name);
    this.layers.push(name);
  }

  collect() {
    const queue = new PriorityQueue<[string, number]>(([_, a], [__, b]) => a < b);
    let count = this.minPriority;
    for (const name of this.layers.slice().reverse()) {
      let priority = this.priorities.get(name);
      if (priority === undefined || priority === null) {
        priority = count;
        count--;
      }
      queue.add([name, priority]);
    }
    return queue;
  }

  clear(layers: Set<string>) {
    this.layers = this.layers.filter(l => layers.has(l) === false);
  }
}
