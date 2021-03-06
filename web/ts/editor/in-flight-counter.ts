function makeCounter<T>(s: Command$, completed$: Completed$): Rx.Observable<number> {
  return Rx.Observable
    .merge([
      s.map(() => 1),
      s.concatMap(a => completed$.filter(c => c.cmdTag === a.tag).take(1)).map(() => -1),
    ])
    .scan((acc, elt) => acc + elt, 0)
}

export function setup(
  stmAdd$: StmAdd$,
  stmCancel$: StmCancel$,
  stmEditAt$: StmEditAt$,
  completed$: Completed$
): Rx.Observable<number> {

  const stmAddCounter$ = makeCounter(stmAdd$, completed$)
  // stmAddCounter$.subscribe(c => console.log("ADD COUNTER", c))

  const stmCancelCounter$ = makeCounter(stmCancel$, completed$)
  // stmCancelCounter$.subscribe(c => console.log("CANCEL COUNTER", c))

  const stmEditAtCounter$ = makeCounter(stmEditAt$, completed$)
  // stmEditAtCounter$.subscribe(c => console.log("EDITAT COUNTER", c))

  const stmActionsInFlightCounter$: Rx.Observable<number> =
    Rx.Observable.combineLatest(
      stmAddCounter$.startWith(0),
      stmCancelCounter$.startWith(0),
      stmEditAtCounter$.startWith(0),
      (x, y, z) => x + y + z
    )

  return stmActionsInFlightCounter$
}
