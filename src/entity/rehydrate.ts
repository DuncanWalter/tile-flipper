interface Rehydrator<T = any> {
  (dry: T): T
}

interface RehydratorFactory<T = any> {
  (childRehydrators?: Map<RehydratorFactory, Rehydrator>): (dry: T) => T
}

interface RehydratorFactorySpec<T, C extends RehydratorFactory[]> {
  getSignature?: (dry: T) => unknown
  rehydrate(
    dry: T,
    ...children: {
      [K in keyof C]: C[K] extends RehydratorFactory<infer U>
        ? Rehydrator<U>
        : never
    }
  ): T
}

// TODO: take a pass at cleaning up
export function createRehydratorFactory<
  Spec extends RehydratorFactorySpec<any, Children>,
  Children extends RehydratorFactory[],
  T extends Spec['rehydrate'] extends (_: infer U, ...args: any[]) => any
    ? U
    : never
>(spec: Spec, ...childRehydratorFactories: Children): RehydratorFactory<T> {
  return function rehydratorFactory(
    childRehydrators: Map<RehydratorFactory, Rehydrator> = new Map(),
  ) {
    const rehydratedEntities = new Map<unknown, T>()

    function rehydrate(dry: T) {
      return spec.rehydrate(
        dry,
        ...(childRehydratorFactories.map(
          crf => childRehydrators.get(crf)!,
        ) as any),
      )
    }

    function rehydrator(dry: T) {
      let signature: unknown

      if (!spec.getSignature) return rehydrate(dry)

      signature = spec.getSignature(dry)

      if (rehydratedEntities.has(signature)) {
        return rehydratedEntities.get(signature)!
      }

      const rehydratedEntity = rehydrate(dry)

      rehydratedEntities.set(signature, rehydratedEntity)

      return rehydratedEntity
    }

    childRehydrators.set(rehydratorFactory, rehydrator)

    for (const childRehydratorFactory of childRehydratorFactories) {
      if (!childRehydrators.has(childRehydratorFactory)) {
        childRehydrators.set(
          childRehydratorFactory,
          childRehydratorFactory(childRehydrators),
        )
      }
    }

    return rehydrator
  }
}
