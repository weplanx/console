export class WpxItems<T> {
  data: T[] = [];
  loading = false;

  searchText = '';

  checked = false;
  indeterminate = false;
  selection = new Map<string, T>();

  constructor(private key: keyof T) {}

  setSelection(data: T): void {
    this.selection.set(data[this.key] as string, data);
    this.updateSelectionStatus();
  }

  removeSelection(id: string): void {
    this.selection.delete(id);
    this.updateSelectionStatus();
  }

  setCurrentSelections(checked: boolean): void {
    this.data.forEach(v => (checked ? this.setSelection(v) : this.removeSelection(v[this.key] as string)));
    this.updateSelectionStatus();
  }

  private updateSelectionStatus(): void {
    this.checked = this.data.every(v => this.selection.has(v[this.key] as string));
    this.indeterminate = !this.checked ? this.data.some(v => this.selection.has(v[this.key] as string)) : false;
  }
}
