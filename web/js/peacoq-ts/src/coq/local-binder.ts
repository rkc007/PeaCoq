// import BinderKind from "./binder-kind";
// declare class ConstrExpr {};
// import NameBase from "./name-base";

abstract class LocalBinder { }

class LocalRawDef extends LocalBinder {
  binderName: Located<NameBase>;
  binderType: ConstrExpr;
  constructor(n: Located<NameBase>, t: ConstrExpr) {
    super();
    this.binderName = n;
    this.binderType = t;
  }
}

class LocalRawAssum extends LocalBinder {
  names: Array<Located<NameBase>>;
  binderKind: BinderKind;
  term: ConstrExpr;
  constructor(l: Array<Located<NameBase>>, bk: BinderKind, t: ConstrExpr) {
    super();
    this.names = l;
    this.binderKind = bk;
    this.term = t;
  }
}

function beginOfBinder(b: LocalBinder): number {
  if (b instanceof LocalRawDef) {
    return b.binderName[0][0];
  }
  if (b instanceof LocalRawAssum) {
    return b.names[0][0][0];
  }
  throw MatchFailure("beginOfBinder", b);
}

function beginOfBinders(bl) {
  if (bl.length === 0) { return 0; }
  else { return beginOfBinder(bl[0]); }
}
