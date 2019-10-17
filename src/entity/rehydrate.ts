interface Rehydrator<T = any> {
  (dry: T): T
}

type ChildRehydrators = Map<RehydratorFactory, Rehydrator>

interface RehydratorFactory<T = any> {
  (childRehydrators?: ChildRehydrators): (dry: T) => T
}

interface RehydratorFactorySpec<T, C extends RehydratorFactory[]> {
  getSignature?: (dry: T) => number | string
  rehydrate(
    dry: T,
    ...children: {
      [K in keyof C]: C[K] extends RehydratorFactory<infer U>
        ? Rehydrator<U>
        : never
    }
  ): T
}

/**
 * When objects are stringified and then parsed into a new runtime, any reference equalities within the object are destroyed and the uniqueness of all parsed ids is lost. Rehydration is the process of fixing parsed entities to preserve these desireable behaviors.
 */
export function createRehydratorFactory<
  Spec extends RehydratorFactorySpec<any, Children>,
  Children extends RehydratorFactory[],
  T extends Spec['rehydrate'] extends (_: infer U, ...args: any[]) => any
    ? U
    : never
>(spec: Spec, ...childRehydratorFactories: Children): RehydratorFactory<T> {
  return function rehydratorFactory(
    childRehydrators: ChildRehydrators = new Map(),
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
      if (!spec.getSignature) return rehydrate(dry)

      const signature = spec.getSignature(dry)

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
