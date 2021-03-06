// /*
// function assignThis(res, t, a) {
//   assert(t !== undefined, "assign, missing contents")
//   assert(t.length === a.length, "length mismatch")
//   _(a).each(function(field, ndx) {
//     res[field] = t[ndx]
//   })
// }

// function assign(t, a) {
//   const res = {}
//   assignThis(res, t, a)
//   return res
// }
// */

// function isVar(term: Term, name?: string): term is Var {
//   if (term instanceof Var) {
//     if (name === undefined) { return true; }
//     return name === term.name
//   }
//   return false
// }

// function isNeq(t: Term) {
//   return (
//     isApp(t)
//     && isVar(t.left, "not")
//     && isInfixBinaryOperation(t.right, "eq")
//   )
// }

// const binaryOperations = [
//   "and",
//   "andb",
//   "concat",
//   "cons",
//   "eq",
//   "equiv",
//   "or",
//   "orb",
//   "minus",
//   "mult",
//   "plus",
// ]

// function isApp(t: Term): t is App {
//   return t.constructor === App
// }

// function isInfixBinaryOperation(term: Term, name?: string): term is App {
//   return (
//     isApp(term)
//     && isApp(term.left)
//     && isVar(term.left.left)
//     && _(binaryOperations).includes(term.left.left.name)
//     && (name ? term.left.left.name === name : true)
//   )
// }

// function getInfixBinaryOperation(term: Term) {
//   if (isInfixBinaryOperation(term)) {
//     return term.left.left
//   } else {
//     return undefined
//   }
// }

// /*
//  * Returns a jQuery Element ready to receive any Term HTML.
//  */
// function mkTermHTML(term) {
//   return $("<span>")
//     .addClass("term")
//     .data("term", term)

// }

// function mkSyntax(s) {
//   return $("<span>").addClass("mkSyntax").text(s)
// }

// function quantifierHTML(quantifier, binders, body) {
//   const res = mkTermHTML(this)
//   res
//     .append(mkSyntax("∀"))
//     .append(" ")

//   _(binders).each(function (binder, ndx) {
//     if (ndx > 0) { res.append(" ") }
//     res.append(binder.toHTML())
//   })
//   res
//     .append(mkSyntax(","))
//     .append(" ")
//     .append(body.toHTML())

//   return res
// }

// const prec = 0
// const precMin = prec++

// const precEquiv = prec++
// const precArrow = prec++
// const precOr = prec++
// const precAnd = prec++
// const precEqual = prec++
// const precNotEqual = precEqual // same
// const precNeg = prec++
// const precEq = prec++
// const precNeq = precEq
// const precCons = prec++
// const precAppend = prec++
// const precOrB = prec++
// const precAndB = prec++
// const precConcat = prec++
// const precOrb = prec++
// const precAndb = prec++
// const precLt = prec++
// const precGt = precLt
// const precLe = precLt
// const precGe = precLt
// const precPlus = prec++
// const precMinus = precPlus
// const precMult = prec++
// const precLParen = prec++
// const precRParen = precLParen
// const precLBrace = prec++
// const precRBrace = precLBrace
// const precVar = prec++
// const precForall = precVar
// const precExists = precVar
// const precLambda = precVar
// const precMatch = precVar
// const precconst = precVar
// const precApp = prec++

// const precMax = prec++

// const assocEquiv = "left"
// const assocArrow = "right"
// const assocOr = "right"
// const assocAnd = "right"
// const assocCons = "right"
// const assocConcat = "right"
// const assocOrb = "left"
// const assocAndb = "left"
// const assocPlus = "left"
// const assocMinus = "left"
// const assocMult = "left"

// function mkTerm(t: any): Term {
//   switch (t.tag) {
//     case "Var": return new Var(t)
//     case "Forall": return new Forall(t)
//     case "Lambda": return new Lambda(t)
//     case "Exists": return new Exists(t)
//     case "Arrow": return new Arrow(t)
//     case "App": return new App(t)
//     case "Match": return new Match(t)
//     case "Let": return new Let(t)
//     case "LetParent": return new LetParen(t)
//     case "Raw": return new Raw(t)
//     default:
//       console.log("Unknown tag for term: ", t)
//       debugger
//   }
//   throw "mkTerm"
// }

// abstract class Term {
//   public isFolded: boolean

//   constructor() {
//     this.isFolded = true
//   }

//   public abstract getPrecedence(): number
//   public abstract toString(): string

// }

// class Var extends Term {
//   public name: string

//   constructor(t: any) {
//     super()
//     this.isFolded = false // no point in folding variables
//     this.name = t.contents
//   }

//   public getPrecedence(): number {
//     return precVar
//   }

//   public getAssociativity(): string {
//     switch (this.name) {
//       case "equiv": return assocEquiv
//       case "or": return assocOr
//       case "and": return assocAnd
//       case "cons": return assocCons
//       case "concat": return assocConcat
//       case "orb": return assocOrb
//       case "andb": return assocAndb
//       case "plus": return assocPlus
//       case "minus": return assocMinus
//       case "mult": return assocMult
//       default:
//         alert("No associativity for: " + this.name)
//         throw new Error("No associativity for: " + this.name)
//     }
//   }

//   public toString(): string {
//     return this.name
//   }

//   public toHTML() {
//     return (
//       mkTermHTML(this)
//         .append(this.name)
//     )
//   }

// }

// class Forall extends Term {
//   public binders: Binder[]
//   public body: Term

//   constructor(t) {
//     super()
//     this.binders = _(t.binders).map(function (binder) {
//       return new Binder(binder)
//     }).value()
//     this.body = mkTerm(t.body)
//   }

//   public getPrecedence() {
//     return precForall
//   }

//   public toString() {
//     return (
//       "∀ "
//       + _(this.binders).reduce(function (acc, binder, ndx) {
//         return (
//           (ndx > 0 ? " " : "")
//           + binder.toString()
//         )
//       }, "")
//       + ", "
//       + this.body.toString()
//     )
//   }

//   public toHTML() {
//     return quantifierHTML("∀", this.binders, this.body)
//   }
// }

// class Lambda extends Term {
//   public binders: Binder[]
//   public body: Term

//   constructor(t) {
//     super()
//     const c = t.contents
//     this.binders = _(c.binders).map(function (binder) {
//       return new Binder(binder)
//     }).value()
//     this.body = mkTerm(c.body)
//   }

//   public getPrecedence() {
//     return precLambda
//   }

//   public toString() {
//     return (
//       "λ "
//       + _(this.binders).reduce(function (acc, binder, ndx) {
//         return (
//           (ndx > 0 ? " " : "")
//           + binder.toString()
//         )
//       }, "")
//       + ", "
//       + this.body.toString()
//     )
//   }

//   public toHTML() {
//     return quantifierHTML("λ", this.binders, this.body)
//   }

// }

// class Exists extends Term {
//   public binders: Binder[]
//   public body: Term

//   constructor(t) {
//     super()
//     const c = t.contents
//     this.binders = _(c.binders).map(function (binder) {
//       return new Binder(binder)
//     }).value()
//     this.body = mkTerm(c.body)
//   }

//   public getPrecedence() {
//     return precExists
//   }

//   public toString() {
//     return (
//       "∃ "
//       + _(this.binders).reduce(function (acc, binder, ndx) {
//         return (
//           (ndx > 0 ? " " : "")
//           + binder.toString()
//         )
//       }, "")
//       + ", "
//       + this.body.toString()
//     )
//   }

//   public toHTML() {
//     return quantifierHTML("∃", this.binders, this.body)
//   }

// }

// class Arrow extends Term {
//   public left: Term
//   public right: Term

//   constructor(t) {
//     super()
//     const c = t.contents
//     this.left = mkTerm(c.left)
//     this.right = mkTerm(c.right)
//   }

//   public getPrecedence() {
//     return precArrow
//   }

//   public toString() {
//     const res = ""

//     switch (this.left.constructor) {
//       // need parentheses
//       case Arrow: // Arrow is right-associative
//       case Exists:
//       case Forall:
//       case Let:
//       case LetParen:
//         res += "(" + this.left.toString() + ")"
//         break
//       // no need for parentheses
//       case App:
//       case Match:
//       case Var:
//         res += this.left.toString()
//         break
//       case Lambda:
//         debugger // should not happen
//       default:
//         throw new Error("Unknown Term: " + this.left)
//     }

//     res += " → "

//     switch (this.right.constructor) {
//       // no need for parentheses
//       case App:
//       case Arrow: // Arrow is right-associative
//       case Exists:
//       case Forall:
//       case Let:
//       case LetParen:
//       case Match:
//       case Var:
//         res += this.right.toString()
//         break
//       case Lambda:
//         debugger // should not happen
//       default:
//         throw new Error("Unknown Term: " + this.right)
//     }

//     return res
//   }

// }

// class App extends Term {
//   public left: Term
//   public right: Term

//   constructor(t) {
//     super()
//     const c = t.contents
//     this.left = mkTerm(c.left)
//     this.right = mkTerm(c.right)
//   }

//   public getPrecedence(): number {
//     /* fully-applied infix binary operators */
//     const binOp = getInfixBinaryOperation(this)
//     if (binOp) {
//       switch (binOp.name) {
//         case "or": return precOr
//         case "and": return precAnd
//         case "neg": return precNeg
//         case "eq": return precEq
//         case "neq": return precNeq
//         case "cons": return precCons
//         case "concat": return precConcat
//         case "orb": return precOrb
//         case "andb": return precAndb
//         case "lt": return precLt
//         case "gt": return precGt
//         case "le": return precLe
//         case "ge": return precGe
//         case "plus": return precPlus
//         case "minus": return precMinus
//         case "mult": return precMult
//         default:
//           debugger
//           break
//       }
//     } else if (isNeq(this)) {
//       return precNeq
//     } else {
//       return precApp
//     }
//     throw "getPrecedence"
//   }

//   public toString() {
//     const res = ""

//     const thisPrec = this.getPrecedence()
//     const topBinOp = getInfixBinaryOperation(this)
//     if (topBinOp) {

//       const left = <App>this.left
//       const leftBinOp = getInfixBinaryOperation(left.right)
//       if (leftBinOp) {
//         if (leftBinOp.name === topBinOp.name) {
//           // same nested infix binary operators, use associativity
//           res += parAssoc(left.right)
//         } else {
//           // different nested infix binary operators, use precedence
//           res += par(left.right, this)
//         }
//       } else {
//         // left operand is not an infix binary operator
//         res += par(left.right, this)
//       }

//       res += " " + binOpString(topBinOp.name) + " "

//       const rightBinOp = getInfixBinaryOperation(this.right)
//       if (rightBinOp) {
//         if (rightBinOp.name === topBinOp.name) {
//           // same nested infix binary operators, use associativity
//           res += parAssoc(this.right)
//         } else if (rightBinOp) {
//           // different nested infix binary operators, use precedence
//           res += par(this.right, this)
//         }
//       } else {
//         res += par(this.right, this)
//       }

//     } else if (isNeq(this)) { // not (eq a b) should print a ≠ b

//       const right = <App>this.right
//       const rightleft = <App>right.left
//       res += par(rightleft.right, this)
//       res += " ≠ "
//       res += par(right.right, this)

//     } else {

//       res += par(this.left, this) + " " + par(this.right, this)

//     }

//     return res

//     /*
//         const topBinOp = this.isFullyAppliedBinaryOperator()
//         // fully-applied infix binary operators
//         if (topBinOp) {

//           const leftBinOp = this.left.right.isFullyAppliedBinaryOperator()
//           if (leftBinOp && leftBinOp.name === topBinOp.name) {
//             const assoc = leftBinOp.getAssociativity()
//             switch (assoc) {
//               case "left":
//                 // no need for parentheses
//                 res += this.left.right.toString()
//                 break
//               case "right":
//                 // need parentheses
//                 res += "(" + this.left.right.toString() + ")"
//                 break
//               default:
//                 throw new Error("Bad associativity: " + assoc)
//             }
//           } else if (leftBinOp !== undefined) {
//             // nested but different operators, precedence matters
//             // namely, if the precedence of the inner operator is
//           // lower, then we need to put parentheses
//             const outerPrec = topBinOp.getPrecedence()
//             const innerPrec = this.left.right.left.left.getPrecedence()
//             if (innerPrec <= outerPrec) {
//               // need parentheses
//               res += "(" + this.left.right.toString() + ")"
//             } else {
//               // no need for parentheses
//               res += this.left.right.toString()
//             }
//           } else {
//             // left operand is not a fully-applied binary operator
//             switch (this.left.constructor) {
//               // need parentheses
//               case Arrow:
//               case Exists:
//               case Forall:
//               case Lambda:
//               case Let:
//               case LetParen:
//                 res += "(" + this.left.right.toString() + ")"
//                 break
//               // no need for parentheses
//               case App: // App is left-associative
//               case Match:
//               case Var:
//                 res += this.left.right.toString()
//                 break
//               default:
//                 throw new Error("Unknown Term: " + this.left)
//             }
//           }

//           res += " " + binOpString(topBinOp.name) + " "

//           const rightBinOp = this.right.isFullyAppliedBinaryOperator()
//           if (rightBinOp && rightBinOp.name === topBinOp.name) {
//             const assoc = rightBinOp.getAssociativity()
//             switch (assoc) {
//               case "left":
//                 // need parentheses
//                 res += "(" + this.right.toString() + ")"
//                 break
//               case "right":
//                 // no need for parentheses
//                 res += this.right.toString()
//                 break
//               default:
//                 throw new Error("Bad associativity: " + assoc)
//             }
//           } else if (rightBinOp !== undefined) {
//             // nested but different operators, precedence matters
//             // namely, if the precedence of the inner operator is
//             // lower, then we need to put parentheses
//             const outerPrec = topBinOp.getPrecedence()
//             const innerPrec = this.right.left.left.getPrecedence()
//             if (innerPrec <= outerPrec) {
//               // need parentheses
//               res += "(" + this.right.toString() + ")"
//             } else {
//               // no need for parentheses
//               res += this.right.toString()
//             }
//           } else {
//             // right operand is not a fully-applied binary operator
//             switch (this.right.constructor) {
//               // need parentheses
//               case App: // App is left-associative
//               case Arrow:
//               case Exists:
//               case Forall:
//               case Lambda:
//               case Let:      // not needed, but Coq prints it
//               case LetParen: // not needed, but Coq prints it
//                 res += "(" + this.right.toString() + ")"
//                 break
//               // no need for parentheses
//               case Match:
//               case Var:
//                 res += this.right.toString()
//                 break
//               default:
//                 throw new Error("Unknown Term: " + this.right)
//             }
//           }

//         } else {

//           switch (this.left.constructor) {
//             // need parentheses
//             case Forall:
//             case Lambda:
//             case Exists:
//             case Arrow:
//             case Let:
//             case LetParen:
//               res += "(" + this.left.toString() + ")"
//               break
//             // no need for parentheses
//             case Var:
//             case App: // App is left-associative
//             case Match:
//               res += this.left.toString()
//               break
//             default:
//               throw new Error("Unknown Term: " + this.left)
//           }

//           res += " "

//           switch (this.right.constructor) {
//             // need parentheses
//             case Forall:
//             case Lambda:
//             case Exists:
//             case Arrow:
//             case Let:
//             case LetParen:
//             case App: // App is left-associative
//               res += "(" + this.left.toString() + ")"
//               break
//             // no need for parentheses
//             case Var:
//             case Match:
//               res += this.left.toString()
//               break
//             default:
//               throw new Error("Unknown Term: " + this.left)
//           }

//         }

//         return res
//         */
//   }

// }

// function binOpString(name) {
//   switch (name) {
//     case "equiv": return "<->"
//     case "or": return "∨"
//     case "and": return "∧"
//     case "eq": return "="
//     case "neq": return "≠"
//     case "cons": return "::"
//     case "concat": return "++"
//     case "orb": return "||"
//     case "andb": return "&&"
//     case "lt": return "<"
//     case "le": return "<="
//     case "gt": return ">"
//     case "ge": return ">="
//     case "plus": return "+"
//     case "minus": return "-"
//     case "mult":
//     case "prod": return "*"
//     default:
//       throw new Error("No binary operator string for: " + name)
//   }
// }

// function par(term: Term, parentTerm: Term): string {
//   const parentPrec = parentTerm.getPrecedence()
//   const termPrec = term.getPrecedence()
//   /* namely, if the precedence of the inner operator is lower, then
//    * we need to put parentheses */
//   if (termPrec <= parentPrec) {
//     return "(" + term.toString() + ")"
//   } else {
//     return term.toString()
//   }
// }

// function parAssoc(term: Term): string {
//   const left = <App>(<App>term).left
//   const leftleft = <Var>left.left
//   const assoc = leftleft.getAssociativity()
//   switch (assoc) {
//     case "left":
//       // no need for parentheses
//       return term.toString()
//     case "right":
//       // need parentheses
//       return "(" + term.toString() + ")"
//     default:
//       throw new Error("Bad associativity: " + assoc)
//   }
// }

// class Match extends Term {
//   public equations: {} // TODO
//   public items: {} // TODO
//   public maybeType: Term | undefined

//   constructor(t) {
//     super()
//     const c = t.contents
//     this.equations = c.equations
//     this.items = c.items
//     this.maybeType = t.maybeType ? mkTerm(this.maybeType) : undefined
//   }

//   public getPrecedence(): number {
//     return precMatch
//   }

//   public toString(): string {
//     return "match ... end"
//   }

// }

// class const extends Term {
//   public bindee: Term
//   public binders: Binder[]
//   public body: Term
//   public maybeType: Term | undefined
//   public names: string[]

//   constructor(t) {
//     super()
//     const c = t.contents
//     this.bindee = mkTerm(c.bindee)
//     this.binders = c.binders
//     this.body = mkTerm(c.body)
//     this.names = c.names
//     this.maybeType = t.contents.maybeType ? mkTerm(t.contents.maybeType) : undefined
//   }

//   public getPrecedence(): number {
//     return precLet
//   }

//   public toString(): string {
//     return "const ... = ... in ..."
//   }

// }

// class LetParen extends Term {
//   public bindee: Term
//   public body: Term
//   public maybeType: Term | undefined
//   public names: string[]

//   constructor(t) {
//     super()
//     const c = t.contents
//     this.bindee = mkTerm(c.bindee)
//     this.body = mkTerm(c.body)
//     this.names = c.names
//     this.maybeType = this.maybeType ? mkTerm(this.maybeType) : undefined
//   }

//   public getPrecedence(): number {
//     return precLet
//   }

//   public toString(): string {
//     return "const (...) = ... in ..."
//   }
// }

// class Raw extends Term {
//   public raw: string

//   constructor(t) {
//     super()
//     this.raw = t
//   }

//   public getPrecedence(): number { return precMax }

//   public toString(): string { return this.raw }

// }

// class Binder {
//   public maybeNames: string[]
//   public maybeType: Term | undefined

//   constructor(t) {
//     this.maybeNames = t.maybeNames
//     this.maybeType = t.maybeType ? mkTerm(this.maybeType) : undefined
//   }

//   public toString(): string {
//     const res = ""

//     _(this.maybeNames).each(function (maybeName, ndx) {
//       if (ndx > 0) { res += " " }
//       res += maybeName ? maybeName : "_"
//     })

//     if (this.maybeType !== undefined) {
//       res = "(" + res + " : " + this.maybeType.toString() + ")"
//     }

//     return res
//   }

// }
