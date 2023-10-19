export type UpperRegister<T = any> = (
  initialValue: T,
  onUpdate: (target: any, props: string | symbol, value: any) => void
) => any;
