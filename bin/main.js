#!/usr/bin/env bun
// @bun
var TQ = Object.create;
var {
	getPrototypeOf: OQ,
	defineProperty: T8,
	getOwnPropertyNames: wQ,
} = Object;
var jQ = Object.prototype.hasOwnProperty;
var s0 = (D, F, _) => {
	_ = D != null ? TQ(OQ(D)) : {};
	let B =
		F || !D || !D.__esModule
			? T8(_, "default", { value: D, enumerable: !0 })
			: _;
	for (let $ of wQ(D))
		if (!jQ.call(B, $)) T8(B, $, { get: () => D[$], enumerable: !0 });
	return B;
};
var W = (D, F) => () => (F || D((F = { exports: {} }).exports, F), F.exports);
var uQ = (D, F) => {
	for (var _ in F)
		T8(D, _, {
			get: F[_],
			enumerable: !0,
			configurable: !0,
			set: (B) => (F[_] = () => B),
		});
};
var R = import.meta.require;
var n2 = W((NQ) => {
	class O8 extends Error {
		constructor(D, F, _) {
			super(_);
			Error.captureStackTrace(this, this.constructor),
				(this.name = this.constructor.name),
				(this.code = F),
				(this.exitCode = D),
				(this.nestedError = void 0);
		}
	}
	class u4 extends O8 {
		constructor(D) {
			super(1, "commander.invalidArgument", D);
			Error.captureStackTrace(this, this.constructor),
				(this.name = this.constructor.name);
		}
	}
	NQ.CommanderError = O8;
	NQ.InvalidArgumentError = u4;
});
var qF = W((gQ) => {
	var { InvalidArgumentError: xQ } = n2();
	class N4 {
		constructor(D, F) {
			switch (
				((this.description = F || ""),
				(this.variadic = !1),
				(this.parseArg = void 0),
				(this.defaultValue = void 0),
				(this.defaultValueDescription = void 0),
				(this.argChoices = void 0),
				D[0])
			) {
				case "<":
					(this.required = !0), (this._name = D.slice(1, -1));
					break;
				case "[":
					(this.required = !1), (this._name = D.slice(1, -1));
					break;
				default:
					(this.required = !0), (this._name = D);
					break;
			}
			if (this._name.length > 3 && this._name.slice(-3) === "...")
				(this.variadic = !0), (this._name = this._name.slice(0, -3));
		}
		name() {
			return this._name;
		}
		_concatValue(D, F) {
			if (F === this.defaultValue || !Array.isArray(F)) return [D];
			return F.concat(D);
		}
		default(D, F) {
			return (this.defaultValue = D), (this.defaultValueDescription = F), this;
		}
		argParser(D) {
			return (this.parseArg = D), this;
		}
		choices(D) {
			return (
				(this.argChoices = D.slice()),
				(this.parseArg = (F, _) => {
					if (!this.argChoices.includes(F))
						throw new xQ(`Allowed choices are ${this.argChoices.join(", ")}.`);
					if (this.variadic) return this._concatValue(F, _);
					return F;
				}),
				this
			);
		}
		argRequired() {
			return (this.required = !0), this;
		}
		argOptional() {
			return (this.required = !1), this;
		}
	}
	function bQ(D) {
		let F = D.name() + (D.variadic === !0 ? "..." : "");
		return D.required ? "<" + F + ">" : "[" + F + "]";
	}
	gQ.Argument = N4;
	gQ.humanReadableArgName = bQ;
});
var w8 = W((fQ) => {
	var { humanReadableArgName: kQ } = qF();
	class S4 {
		constructor() {
			(this.helpWidth = void 0),
				(this.minWidthToWrap = 40),
				(this.sortSubcommands = !1),
				(this.sortOptions = !1),
				(this.showGlobalOptions = !1);
		}
		prepareContext(D) {
			this.helpWidth = this.helpWidth ?? D.helpWidth ?? 80;
		}
		visibleCommands(D) {
			let F = D.commands.filter((B) => !B._hidden),
				_ = D._getHelpCommand();
			if (_ && !_._hidden) F.push(_);
			if (this.sortSubcommands)
				F.sort((B, $) => {
					return B.name().localeCompare($.name());
				});
			return F;
		}
		compareOptions(D, F) {
			let _ = (B) => {
				return B.short ? B.short.replace(/^-/, "") : B.long.replace(/^--/, "");
			};
			return _(D).localeCompare(_(F));
		}
		visibleOptions(D) {
			let F = D.options.filter((B) => !B.hidden),
				_ = D._getHelpOption();
			if (_ && !_.hidden) {
				let B = _.short && D._findOption(_.short),
					$ = _.long && D._findOption(_.long);
				if (!B && !$) F.push(_);
				else if (_.long && !$) F.push(D.createOption(_.long, _.description));
				else if (_.short && !B) F.push(D.createOption(_.short, _.description));
			}
			if (this.sortOptions) F.sort(this.compareOptions);
			return F;
		}
		visibleGlobalOptions(D) {
			if (!this.showGlobalOptions) return [];
			let F = [];
			for (let _ = D.parent; _; _ = _.parent) {
				let B = _.options.filter(($) => !$.hidden);
				F.push(...B);
			}
			if (this.sortOptions) F.sort(this.compareOptions);
			return F;
		}
		visibleArguments(D) {
			if (D._argsDescription)
				D.registeredArguments.forEach((F) => {
					F.description = F.description || D._argsDescription[F.name()] || "";
				});
			if (D.registeredArguments.find((F) => F.description))
				return D.registeredArguments;
			return [];
		}
		subcommandTerm(D) {
			let F = D.registeredArguments.map((_) => kQ(_)).join(" ");
			return (
				D._name +
				(D._aliases[0] ? "|" + D._aliases[0] : "") +
				(D.options.length ? " [options]" : "") +
				(F ? " " + F : "")
			);
		}
		optionTerm(D) {
			return D.flags;
		}
		argumentTerm(D) {
			return D.name();
		}
		longestSubcommandTermLength(D, F) {
			return F.visibleCommands(D).reduce((_, B) => {
				return Math.max(
					_,
					this.displayWidth(F.styleSubcommandTerm(F.subcommandTerm(B))),
				);
			}, 0);
		}
		longestOptionTermLength(D, F) {
			return F.visibleOptions(D).reduce((_, B) => {
				return Math.max(
					_,
					this.displayWidth(F.styleOptionTerm(F.optionTerm(B))),
				);
			}, 0);
		}
		longestGlobalOptionTermLength(D, F) {
			return F.visibleGlobalOptions(D).reduce((_, B) => {
				return Math.max(
					_,
					this.displayWidth(F.styleOptionTerm(F.optionTerm(B))),
				);
			}, 0);
		}
		longestArgumentTermLength(D, F) {
			return F.visibleArguments(D).reduce((_, B) => {
				return Math.max(
					_,
					this.displayWidth(F.styleArgumentTerm(F.argumentTerm(B))),
				);
			}, 0);
		}
		commandUsage(D) {
			let F = D._name;
			if (D._aliases[0]) F = F + "|" + D._aliases[0];
			let _ = "";
			for (let B = D.parent; B; B = B.parent) _ = B.name() + " " + _;
			return _ + F + " " + D.usage();
		}
		commandDescription(D) {
			return D.description();
		}
		subcommandDescription(D) {
			return D.summary() || D.description();
		}
		optionDescription(D) {
			let F = [];
			if (D.argChoices)
				F.push(
					`choices: ${D.argChoices.map((_) => JSON.stringify(_)).join(", ")}`,
				);
			if (D.defaultValue !== void 0) {
				if (
					D.required ||
					D.optional ||
					(D.isBoolean() && typeof D.defaultValue === "boolean")
				)
					F.push(
						`default: ${D.defaultValueDescription || JSON.stringify(D.defaultValue)}`,
					);
			}
			if (D.presetArg !== void 0 && D.optional)
				F.push(`preset: ${JSON.stringify(D.presetArg)}`);
			if (D.envVar !== void 0) F.push(`env: ${D.envVar}`);
			if (F.length > 0) return `${D.description} (${F.join(", ")})`;
			return D.description;
		}
		argumentDescription(D) {
			let F = [];
			if (D.argChoices)
				F.push(
					`choices: ${D.argChoices.map((_) => JSON.stringify(_)).join(", ")}`,
				);
			if (D.defaultValue !== void 0)
				F.push(
					`default: ${D.defaultValueDescription || JSON.stringify(D.defaultValue)}`,
				);
			if (F.length > 0) {
				let _ = `(${F.join(", ")})`;
				if (D.description) return `${D.description} ${_}`;
				return _;
			}
			return D.description;
		}
		formatHelp(D, F) {
			let _ = F.padWidth(D, F),
				B = F.helpWidth ?? 80;
			function $(z, A) {
				return F.formatItem(z, _, A, F);
			}
			let Z = [
					`${F.styleTitle("Usage:")} ${F.styleUsage(F.commandUsage(D))}`,
					"",
				],
				q = F.commandDescription(D);
			if (q.length > 0)
				Z = Z.concat([F.boxWrap(F.styleCommandDescription(q), B), ""]);
			let X = F.visibleArguments(D).map((z) => {
				return $(
					F.styleArgumentTerm(F.argumentTerm(z)),
					F.styleArgumentDescription(F.argumentDescription(z)),
				);
			});
			if (X.length > 0) Z = Z.concat([F.styleTitle("Arguments:"), ...X, ""]);
			let Q = F.visibleOptions(D).map((z) => {
				return $(
					F.styleOptionTerm(F.optionTerm(z)),
					F.styleOptionDescription(F.optionDescription(z)),
				);
			});
			if (Q.length > 0) Z = Z.concat([F.styleTitle("Options:"), ...Q, ""]);
			if (F.showGlobalOptions) {
				let z = F.visibleGlobalOptions(D).map((A) => {
					return $(
						F.styleOptionTerm(F.optionTerm(A)),
						F.styleOptionDescription(F.optionDescription(A)),
					);
				});
				if (z.length > 0)
					Z = Z.concat([F.styleTitle("Global Options:"), ...z, ""]);
			}
			let J = F.visibleCommands(D).map((z) => {
				return $(
					F.styleSubcommandTerm(F.subcommandTerm(z)),
					F.styleSubcommandDescription(F.subcommandDescription(z)),
				);
			});
			if (J.length > 0) Z = Z.concat([F.styleTitle("Commands:"), ...J, ""]);
			return Z.join(`
`);
		}
		displayWidth(D) {
			return E4(D).length;
		}
		styleTitle(D) {
			return D;
		}
		styleUsage(D) {
			return D.split(" ")
				.map((F) => {
					if (F === "[options]") return this.styleOptionText(F);
					if (F === "[command]") return this.styleSubcommandText(F);
					if (F[0] === "[" || F[0] === "<") return this.styleArgumentText(F);
					return this.styleCommandText(F);
				})
				.join(" ");
		}
		styleCommandDescription(D) {
			return this.styleDescriptionText(D);
		}
		styleOptionDescription(D) {
			return this.styleDescriptionText(D);
		}
		styleSubcommandDescription(D) {
			return this.styleDescriptionText(D);
		}
		styleArgumentDescription(D) {
			return this.styleDescriptionText(D);
		}
		styleDescriptionText(D) {
			return D;
		}
		styleOptionTerm(D) {
			return this.styleOptionText(D);
		}
		styleSubcommandTerm(D) {
			return D.split(" ")
				.map((F) => {
					if (F === "[options]") return this.styleOptionText(F);
					if (F[0] === "[" || F[0] === "<") return this.styleArgumentText(F);
					return this.styleSubcommandText(F);
				})
				.join(" ");
		}
		styleArgumentTerm(D) {
			return this.styleArgumentText(D);
		}
		styleOptionText(D) {
			return D;
		}
		styleArgumentText(D) {
			return D;
		}
		styleSubcommandText(D) {
			return D;
		}
		styleCommandText(D) {
			return D;
		}
		padWidth(D, F) {
			return Math.max(
				F.longestOptionTermLength(D, F),
				F.longestGlobalOptionTermLength(D, F),
				F.longestSubcommandTermLength(D, F),
				F.longestArgumentTermLength(D, F),
			);
		}
		preformatted(D) {
			return /\n[^\S\r\n]/.test(D);
		}
		formatItem(D, F, _, B) {
			let Z = " ".repeat(2);
			if (!_) return Z + D;
			let q = D.padEnd(F + D.length - B.displayWidth(D)),
				X = 2,
				J = (this.helpWidth ?? 80) - F - X - 2,
				z;
			if (J < this.minWidthToWrap || B.preformatted(_)) z = _;
			else
				z = B.boxWrap(_, J).replace(
					/\n/g,
					`
` + " ".repeat(F + X),
				);
			return (
				Z +
				q +
				" ".repeat(X) +
				z.replace(
					/\n/g,
					`
${Z}`,
				)
			);
		}
		boxWrap(D, F) {
			if (F < this.minWidthToWrap) return D;
			let _ = D.split(/\r\n|\n/),
				B = /[\s]*[^\s]+/g,
				$ = [];
			return (
				_.forEach((Z) => {
					let q = Z.match(B);
					if (q === null) {
						$.push("");
						return;
					}
					let X = [q.shift()],
						Q = this.displayWidth(X[0]);
					q.forEach((J) => {
						let z = this.displayWidth(J);
						if (Q + z <= F) {
							X.push(J), (Q += z);
							return;
						}
						$.push(X.join(""));
						let A = J.trimStart();
						(X = [A]), (Q = this.displayWidth(A));
					}),
						$.push(X.join(""));
				}),
				$.join(`
`)
			);
		}
	}
	function E4(D) {
		let F = /\x1b\[\d*(;\d*)*m/g;
		return D.replace(F, "");
	}
	fQ.Help = S4;
	fQ.stripColor = E4;
});
var j8 = W((cQ) => {
	var { InvalidArgumentError: lQ } = n2();
	class b4 {
		constructor(D, F) {
			(this.flags = D),
				(this.description = F || ""),
				(this.required = D.includes("<")),
				(this.optional = D.includes("[")),
				(this.variadic = /\w\.\.\.[>\]]$/.test(D)),
				(this.mandatory = !1);
			let _ = dQ(D);
			if (
				((this.short = _.shortFlag),
				(this.long = _.longFlag),
				(this.negate = !1),
				this.long)
			)
				this.negate = this.long.startsWith("--no-");
			(this.defaultValue = void 0),
				(this.defaultValueDescription = void 0),
				(this.presetArg = void 0),
				(this.envVar = void 0),
				(this.parseArg = void 0),
				(this.hidden = !1),
				(this.argChoices = void 0),
				(this.conflictsWith = []),
				(this.implied = void 0);
		}
		default(D, F) {
			return (this.defaultValue = D), (this.defaultValueDescription = F), this;
		}
		preset(D) {
			return (this.presetArg = D), this;
		}
		conflicts(D) {
			return (this.conflictsWith = this.conflictsWith.concat(D)), this;
		}
		implies(D) {
			let F = D;
			if (typeof D === "string") F = { [D]: !0 };
			return (this.implied = Object.assign(this.implied || {}, F)), this;
		}
		env(D) {
			return (this.envVar = D), this;
		}
		argParser(D) {
			return (this.parseArg = D), this;
		}
		makeOptionMandatory(D = !0) {
			return (this.mandatory = !!D), this;
		}
		hideHelp(D = !0) {
			return (this.hidden = !!D), this;
		}
		_concatValue(D, F) {
			if (F === this.defaultValue || !Array.isArray(F)) return [D];
			return F.concat(D);
		}
		choices(D) {
			return (
				(this.argChoices = D.slice()),
				(this.parseArg = (F, _) => {
					if (!this.argChoices.includes(F))
						throw new lQ(`Allowed choices are ${this.argChoices.join(", ")}.`);
					if (this.variadic) return this._concatValue(F, _);
					return F;
				}),
				this
			);
		}
		name() {
			if (this.long) return this.long.replace(/^--/, "");
			return this.short.replace(/^-/, "");
		}
		attributeName() {
			if (this.negate) return x4(this.name().replace(/^no-/, ""));
			return x4(this.name());
		}
		is(D) {
			return this.short === D || this.long === D;
		}
		isBoolean() {
			return !this.required && !this.optional && !this.negate;
		}
	}
	class g4 {
		constructor(D) {
			(this.positiveOptions = new Map()),
				(this.negativeOptions = new Map()),
				(this.dualOptions = new Set()),
				D.forEach((F) => {
					if (F.negate) this.negativeOptions.set(F.attributeName(), F);
					else this.positiveOptions.set(F.attributeName(), F);
				}),
				this.negativeOptions.forEach((F, _) => {
					if (this.positiveOptions.has(_)) this.dualOptions.add(_);
				});
		}
		valueFromOption(D, F) {
			let _ = F.attributeName();
			if (!this.dualOptions.has(_)) return !0;
			let B = this.negativeOptions.get(_).presetArg,
				$ = B !== void 0 ? B : !1;
			return F.negate === ($ === D);
		}
	}
	function x4(D) {
		return D.split("-").reduce((F, _) => {
			return F + _[0].toUpperCase() + _.slice(1);
		});
	}
	function dQ(D) {
		let F,
			_,
			B = /^-[^-]$/,
			$ = /^--[^-]/,
			Z = D.split(/[ |,]+/).concat("guard");
		if (B.test(Z[0])) F = Z.shift();
		if ($.test(Z[0])) _ = Z.shift();
		if (!F && B.test(Z[0])) F = Z.shift();
		if (!F && $.test(Z[0])) (F = _), (_ = Z.shift());
		if (Z[0].startsWith("-")) {
			let q = Z[0],
				X = `option creation failed due to '${q}' in option flags '${D}'`;
			if (/^-[^-][^-]/.test(q))
				throw new Error(`${X}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`);
			if (B.test(q))
				throw new Error(`${X}
- too many short flags`);
			if ($.test(q))
				throw new Error(`${X}
- too many long flags`);
			throw new Error(`${X}
- unrecognised flag format`);
		}
		if (F === void 0 && _ === void 0)
			throw new Error(
				`option creation failed due to no flags found in '${D}'.`,
			);
		return { shortFlag: F, longFlag: _ };
	}
	cQ.Option = b4;
	cQ.DualOptions = g4;
});
var v4 = W((rQ) => {
	function iQ(D, F) {
		if (Math.abs(D.length - F.length) > 3) return Math.max(D.length, F.length);
		let _ = [];
		for (let B = 0; B <= D.length; B++) _[B] = [B];
		for (let B = 0; B <= F.length; B++) _[0][B] = B;
		for (let B = 1; B <= F.length; B++)
			for (let $ = 1; $ <= D.length; $++) {
				let Z = 1;
				if (D[$ - 1] === F[B - 1]) Z = 0;
				else Z = 1;
				if (
					((_[$][B] = Math.min(
						_[$ - 1][B] + 1,
						_[$][B - 1] + 1,
						_[$ - 1][B - 1] + Z,
					)),
					$ > 1 && B > 1 && D[$ - 1] === F[B - 2] && D[$ - 2] === F[B - 1])
				)
					_[$][B] = Math.min(_[$][B], _[$ - 2][B - 2] + 1);
			}
		return _[D.length][F.length];
	}
	function sQ(D, F) {
		if (!F || F.length === 0) return "";
		F = Array.from(new Set(F));
		let _ = D.startsWith("--");
		if (_) (D = D.slice(2)), (F = F.map((q) => q.slice(2)));
		let B = [],
			$ = 3,
			Z = 0.4;
		if (
			(F.forEach((q) => {
				if (q.length <= 1) return;
				let X = iQ(D, q),
					Q = Math.max(D.length, q.length);
				if ((Q - X) / Q > Z) {
					if (X < $) ($ = X), (B = [q]);
					else if (X === $) B.push(q);
				}
			}),
			B.sort((q, X) => q.localeCompare(X)),
			_)
		)
			B = B.map((q) => `--${q}`);
		if (B.length > 1)
			return `
(Did you mean one of ${B.join(", ")}?)`;
		if (B.length === 1)
			return `
(Did you mean ${B[0]}?)`;
		return "";
	}
	rQ.suggestSimilar = sQ;
});
var m4 = W((BJ) => {
	var oQ = R("events").EventEmitter,
		u8 = R("child_process"),
		r0 = R("path"),
		ZF = R("fs"),
		S = R("process"),
		{ Argument: tQ, humanReadableArgName: eQ } = qF(),
		{ CommanderError: N8 } = n2(),
		{ Help: DJ, stripColor: FJ } = w8(),
		{ Option: y4, DualOptions: _J } = j8(),
		{ suggestSimilar: k4 } = v4();
	class E8 extends oQ {
		constructor(D) {
			super();
			(this.commands = []),
				(this.options = []),
				(this.parent = null),
				(this._allowUnknownOption = !1),
				(this._allowExcessArguments = !1),
				(this.registeredArguments = []),
				(this._args = this.registeredArguments),
				(this.args = []),
				(this.rawArgs = []),
				(this.processedArgs = []),
				(this._scriptPath = null),
				(this._name = D || ""),
				(this._optionValues = {}),
				(this._optionValueSources = {}),
				(this._storeOptionsAsProperties = !1),
				(this._actionHandler = null),
				(this._executableHandler = !1),
				(this._executableFile = null),
				(this._executableDir = null),
				(this._defaultCommandName = null),
				(this._exitCallback = null),
				(this._aliases = []),
				(this._combineFlagAndOptionalValue = !0),
				(this._description = ""),
				(this._summary = ""),
				(this._argsDescription = void 0),
				(this._enablePositionalOptions = !1),
				(this._passThroughOptions = !1),
				(this._lifeCycleHooks = {}),
				(this._showHelpAfterError = !1),
				(this._showSuggestionAfterError = !0),
				(this._savedState = null),
				(this._outputConfiguration = {
					writeOut: (F) => S.stdout.write(F),
					writeErr: (F) => S.stderr.write(F),
					outputError: (F, _) => _(F),
					getOutHelpWidth: () => (S.stdout.isTTY ? S.stdout.columns : void 0),
					getErrHelpWidth: () => (S.stderr.isTTY ? S.stderr.columns : void 0),
					getOutHasColors: () =>
						S8() ?? (S.stdout.isTTY && S.stdout.hasColors?.()),
					getErrHasColors: () =>
						S8() ?? (S.stderr.isTTY && S.stderr.hasColors?.()),
					stripColor: (F) => FJ(F),
				}),
				(this._hidden = !1),
				(this._helpOption = void 0),
				(this._addImplicitHelpCommand = void 0),
				(this._helpCommand = void 0),
				(this._helpConfiguration = {});
		}
		copyInheritedSettings(D) {
			return (
				(this._outputConfiguration = D._outputConfiguration),
				(this._helpOption = D._helpOption),
				(this._helpCommand = D._helpCommand),
				(this._helpConfiguration = D._helpConfiguration),
				(this._exitCallback = D._exitCallback),
				(this._storeOptionsAsProperties = D._storeOptionsAsProperties),
				(this._combineFlagAndOptionalValue = D._combineFlagAndOptionalValue),
				(this._allowExcessArguments = D._allowExcessArguments),
				(this._enablePositionalOptions = D._enablePositionalOptions),
				(this._showHelpAfterError = D._showHelpAfterError),
				(this._showSuggestionAfterError = D._showSuggestionAfterError),
				this
			);
		}
		_getCommandAndAncestors() {
			let D = [];
			for (let F = this; F; F = F.parent) D.push(F);
			return D;
		}
		command(D, F, _) {
			let B = F,
				$ = _;
			if (typeof B === "object" && B !== null) ($ = B), (B = null);
			$ = $ || {};
			let [, Z, q] = D.match(/([^ ]+) *(.*)/),
				X = this.createCommand(Z);
			if (B) X.description(B), (X._executableHandler = !0);
			if ($.isDefault) this._defaultCommandName = X._name;
			if (
				((X._hidden = !!($.noHelp || $.hidden)),
				(X._executableFile = $.executableFile || null),
				q)
			)
				X.arguments(q);
			if (
				(this._registerCommand(X),
				(X.parent = this),
				X.copyInheritedSettings(this),
				B)
			)
				return this;
			return X;
		}
		createCommand(D) {
			return new E8(D);
		}
		createHelp() {
			return Object.assign(new DJ(), this.configureHelp());
		}
		configureHelp(D) {
			if (D === void 0) return this._helpConfiguration;
			return (this._helpConfiguration = D), this;
		}
		configureOutput(D) {
			if (D === void 0) return this._outputConfiguration;
			return Object.assign(this._outputConfiguration, D), this;
		}
		showHelpAfterError(D = !0) {
			if (typeof D !== "string") D = !!D;
			return (this._showHelpAfterError = D), this;
		}
		showSuggestionAfterError(D = !0) {
			return (this._showSuggestionAfterError = !!D), this;
		}
		addCommand(D, F) {
			if (!D._name)
				throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
			if (((F = F || {}), F.isDefault)) this._defaultCommandName = D._name;
			if (F.noHelp || F.hidden) D._hidden = !0;
			return (
				this._registerCommand(D),
				(D.parent = this),
				D._checkForBrokenPassThrough(),
				this
			);
		}
		createArgument(D, F) {
			return new tQ(D, F);
		}
		argument(D, F, _, B) {
			let $ = this.createArgument(D, F);
			if (typeof _ === "function") $.default(B).argParser(_);
			else $.default(_);
			return this.addArgument($), this;
		}
		arguments(D) {
			return (
				D.trim()
					.split(/ +/)
					.forEach((F) => {
						this.argument(F);
					}),
				this
			);
		}
		addArgument(D) {
			let F = this.registeredArguments.slice(-1)[0];
			if (F && F.variadic)
				throw new Error(`only the last argument can be variadic '${F.name()}'`);
			if (D.required && D.defaultValue !== void 0 && D.parseArg === void 0)
				throw new Error(
					`a default value for a required argument is never used: '${D.name()}'`,
				);
			return this.registeredArguments.push(D), this;
		}
		helpCommand(D, F) {
			if (typeof D === "boolean")
				return (this._addImplicitHelpCommand = D), this;
			D = D ?? "help [command]";
			let [, _, B] = D.match(/([^ ]+) *(.*)/),
				$ = F ?? "display help for command",
				Z = this.createCommand(_);
			if ((Z.helpOption(!1), B)) Z.arguments(B);
			if ($) Z.description($);
			return (this._addImplicitHelpCommand = !0), (this._helpCommand = Z), this;
		}
		addHelpCommand(D, F) {
			if (typeof D !== "object") return this.helpCommand(D, F), this;
			return (this._addImplicitHelpCommand = !0), (this._helpCommand = D), this;
		}
		_getHelpCommand() {
			if (
				this._addImplicitHelpCommand ??
				(this.commands.length &&
					!this._actionHandler &&
					!this._findCommand("help"))
			) {
				if (this._helpCommand === void 0) this.helpCommand(void 0, void 0);
				return this._helpCommand;
			}
			return null;
		}
		hook(D, F) {
			let _ = ["preSubcommand", "preAction", "postAction"];
			if (!_.includes(D))
				throw new Error(`Unexpected value for event passed to hook : '${D}'.
Expecting one of '${_.join("', '")}'`);
			if (this._lifeCycleHooks[D]) this._lifeCycleHooks[D].push(F);
			else this._lifeCycleHooks[D] = [F];
			return this;
		}
		exitOverride(D) {
			if (D) this._exitCallback = D;
			else
				this._exitCallback = (F) => {
					if (F.code !== "commander.executeSubCommandAsync") throw F;
				};
			return this;
		}
		_exit(D, F, _) {
			if (this._exitCallback) this._exitCallback(new N8(D, F, _));
			S.exit(D);
		}
		action(D) {
			let F = (_) => {
				let B = this.registeredArguments.length,
					$ = _.slice(0, B);
				if (this._storeOptionsAsProperties) $[B] = this;
				else $[B] = this.opts();
				return $.push(this), D.apply(this, $);
			};
			return (this._actionHandler = F), this;
		}
		createOption(D, F) {
			return new y4(D, F);
		}
		_callParseArg(D, F, _, B) {
			try {
				return D.parseArg(F, _);
			} catch ($) {
				if ($.code === "commander.invalidArgument") {
					let Z = `${B} ${$.message}`;
					this.error(Z, { exitCode: $.exitCode, code: $.code });
				}
				throw $;
			}
		}
		_registerOption(D) {
			let F =
				(D.short && this._findOption(D.short)) ||
				(D.long && this._findOption(D.long));
			if (F) {
				let _ = D.long && this._findOption(D.long) ? D.long : D.short;
				throw new Error(`Cannot add option '${D.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${_}'
-  already used by option '${F.flags}'`);
			}
			this.options.push(D);
		}
		_registerCommand(D) {
			let F = (B) => {
					return [B.name()].concat(B.aliases());
				},
				_ = F(D).find((B) => this._findCommand(B));
			if (_) {
				let B = F(this._findCommand(_)).join("|"),
					$ = F(D).join("|");
				throw new Error(
					`cannot add command '${$}' as already have command '${B}'`,
				);
			}
			this.commands.push(D);
		}
		addOption(D) {
			this._registerOption(D);
			let F = D.name(),
				_ = D.attributeName();
			if (D.negate) {
				let $ = D.long.replace(/^--no-/, "--");
				if (!this._findOption($))
					this.setOptionValueWithSource(
						_,
						D.defaultValue === void 0 ? !0 : D.defaultValue,
						"default",
					);
			} else if (D.defaultValue !== void 0)
				this.setOptionValueWithSource(_, D.defaultValue, "default");
			let B = ($, Z, q) => {
				if ($ == null && D.presetArg !== void 0) $ = D.presetArg;
				let X = this.getOptionValue(_);
				if ($ !== null && D.parseArg) $ = this._callParseArg(D, $, X, Z);
				else if ($ !== null && D.variadic) $ = D._concatValue($, X);
				if ($ == null)
					if (D.negate) $ = !1;
					else if (D.isBoolean() || D.optional) $ = !0;
					else $ = "";
				this.setOptionValueWithSource(_, $, q);
			};
			if (
				(this.on("option:" + F, ($) => {
					let Z = `error: option '${D.flags}' argument '${$}' is invalid.`;
					B($, Z, "cli");
				}),
				D.envVar)
			)
				this.on("optionEnv:" + F, ($) => {
					let Z = `error: option '${D.flags}' value '${$}' from env '${D.envVar}' is invalid.`;
					B($, Z, "env");
				});
			return this;
		}
		_optionEx(D, F, _, B, $) {
			if (typeof F === "object" && F instanceof y4)
				throw new Error(
					"To add an Option object use addOption() instead of option() or requiredOption()",
				);
			let Z = this.createOption(F, _);
			if ((Z.makeOptionMandatory(!!D.mandatory), typeof B === "function"))
				Z.default($).argParser(B);
			else if (B instanceof RegExp) {
				let q = B;
				(B = (X, Q) => {
					let J = q.exec(X);
					return J ? J[0] : Q;
				}),
					Z.default($).argParser(B);
			} else Z.default(B);
			return this.addOption(Z);
		}
		option(D, F, _, B) {
			return this._optionEx({}, D, F, _, B);
		}
		requiredOption(D, F, _, B) {
			return this._optionEx({ mandatory: !0 }, D, F, _, B);
		}
		combineFlagAndOptionalValue(D = !0) {
			return (this._combineFlagAndOptionalValue = !!D), this;
		}
		allowUnknownOption(D = !0) {
			return (this._allowUnknownOption = !!D), this;
		}
		allowExcessArguments(D = !0) {
			return (this._allowExcessArguments = !!D), this;
		}
		enablePositionalOptions(D = !0) {
			return (this._enablePositionalOptions = !!D), this;
		}
		passThroughOptions(D = !0) {
			return (
				(this._passThroughOptions = !!D),
				this._checkForBrokenPassThrough(),
				this
			);
		}
		_checkForBrokenPassThrough() {
			if (
				this.parent &&
				this._passThroughOptions &&
				!this.parent._enablePositionalOptions
			)
				throw new Error(
					`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`,
				);
		}
		storeOptionsAsProperties(D = !0) {
			if (this.options.length)
				throw new Error(
					"call .storeOptionsAsProperties() before adding options",
				);
			if (Object.keys(this._optionValues).length)
				throw new Error(
					"call .storeOptionsAsProperties() before setting option values",
				);
			return (this._storeOptionsAsProperties = !!D), this;
		}
		getOptionValue(D) {
			if (this._storeOptionsAsProperties) return this[D];
			return this._optionValues[D];
		}
		setOptionValue(D, F) {
			return this.setOptionValueWithSource(D, F, void 0);
		}
		setOptionValueWithSource(D, F, _) {
			if (this._storeOptionsAsProperties) this[D] = F;
			else this._optionValues[D] = F;
			return (this._optionValueSources[D] = _), this;
		}
		getOptionValueSource(D) {
			return this._optionValueSources[D];
		}
		getOptionValueSourceWithGlobals(D) {
			let F;
			return (
				this._getCommandAndAncestors().forEach((_) => {
					if (_.getOptionValueSource(D) !== void 0)
						F = _.getOptionValueSource(D);
				}),
				F
			);
		}
		_prepareUserArgs(D, F) {
			if (D !== void 0 && !Array.isArray(D))
				throw new Error("first parameter to parse must be array or undefined");
			if (((F = F || {}), D === void 0 && F.from === void 0)) {
				if (S.versions?.electron) F.from = "electron";
				let B = S.execArgv ?? [];
				if (
					B.includes("-e") ||
					B.includes("--eval") ||
					B.includes("-p") ||
					B.includes("--print")
				)
					F.from = "eval";
			}
			if (D === void 0) D = S.argv;
			this.rawArgs = D.slice();
			let _;
			switch (F.from) {
				case void 0:
				case "node":
					(this._scriptPath = D[1]), (_ = D.slice(2));
					break;
				case "electron":
					if (S.defaultApp) (this._scriptPath = D[1]), (_ = D.slice(2));
					else _ = D.slice(1);
					break;
				case "user":
					_ = D.slice(0);
					break;
				case "eval":
					_ = D.slice(1);
					break;
				default:
					throw new Error(`unexpected parse option { from: '${F.from}' }`);
			}
			if (!this._name && this._scriptPath)
				this.nameFromFilename(this._scriptPath);
			return (this._name = this._name || "program"), _;
		}
		parse(D, F) {
			this._prepareForParse();
			let _ = this._prepareUserArgs(D, F);
			return this._parseCommand([], _), this;
		}
		async parseAsync(D, F) {
			this._prepareForParse();
			let _ = this._prepareUserArgs(D, F);
			return await this._parseCommand([], _), this;
		}
		_prepareForParse() {
			if (this._savedState === null) this.saveStateBeforeParse();
			else this.restoreStateBeforeParse();
		}
		saveStateBeforeParse() {
			this._savedState = {
				_name: this._name,
				_optionValues: { ...this._optionValues },
				_optionValueSources: { ...this._optionValueSources },
			};
		}
		restoreStateBeforeParse() {
			if (this._storeOptionsAsProperties)
				throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
			(this._name = this._savedState._name),
				(this._scriptPath = null),
				(this.rawArgs = []),
				(this._optionValues = { ...this._savedState._optionValues }),
				(this._optionValueSources = {
					...this._savedState._optionValueSources,
				}),
				(this.args = []),
				(this.processedArgs = []);
		}
		_checkForMissingExecutable(D, F, _) {
			if (ZF.existsSync(D)) return;
			let B = F
					? `searched for local subcommand relative to directory '${F}'`
					: "no directory for search for local subcommand, use .executableDir() to supply a custom directory",
				$ = `'${D}' does not exist
 - if '${_}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${B}`;
			throw new Error($);
		}
		_executeSubCommand(D, F) {
			F = F.slice();
			let _ = !1,
				B = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
			function $(J, z) {
				let A = r0.resolve(J, z);
				if (ZF.existsSync(A)) return A;
				if (B.includes(r0.extname(z))) return;
				let L = B.find((G) => ZF.existsSync(`${A}${G}`));
				if (L) return `${A}${L}`;
				return;
			}
			this._checkForMissingMandatoryOptions(),
				this._checkForConflictingOptions();
			let Z = D._executableFile || `${this._name}-${D._name}`,
				q = this._executableDir || "";
			if (this._scriptPath) {
				let J;
				try {
					J = ZF.realpathSync(this._scriptPath);
				} catch {
					J = this._scriptPath;
				}
				q = r0.resolve(r0.dirname(J), q);
			}
			if (q) {
				let J = $(q, Z);
				if (!J && !D._executableFile && this._scriptPath) {
					let z = r0.basename(this._scriptPath, r0.extname(this._scriptPath));
					if (z !== this._name) J = $(q, `${z}-${D._name}`);
				}
				Z = J || Z;
			}
			_ = B.includes(r0.extname(Z));
			let X;
			if (S.platform !== "win32")
				if (_)
					F.unshift(Z),
						(F = f4(S.execArgv).concat(F)),
						(X = u8.spawn(S.argv[0], F, { stdio: "inherit" }));
				else X = u8.spawn(Z, F, { stdio: "inherit" });
			else
				this._checkForMissingExecutable(Z, q, D._name),
					F.unshift(Z),
					(F = f4(S.execArgv).concat(F)),
					(X = u8.spawn(S.execPath, F, { stdio: "inherit" }));
			if (!X.killed)
				["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach((z) => {
					S.on(z, () => {
						if (X.killed === !1 && X.exitCode === null) X.kill(z);
					});
				});
			let Q = this._exitCallback;
			X.on("close", (J) => {
				if (((J = J ?? 1), !Q)) S.exit(J);
				else Q(new N8(J, "commander.executeSubCommandAsync", "(close)"));
			}),
				X.on("error", (J) => {
					if (J.code === "ENOENT")
						this._checkForMissingExecutable(Z, q, D._name);
					else if (J.code === "EACCES")
						throw new Error(`'${Z}' not executable`);
					if (!Q) S.exit(1);
					else {
						let z = new N8(1, "commander.executeSubCommandAsync", "(error)");
						(z.nestedError = J), Q(z);
					}
				}),
				(this.runningCommand = X);
		}
		_dispatchSubcommand(D, F, _) {
			let B = this._findCommand(D);
			if (!B) this.help({ error: !0 });
			B._prepareForParse();
			let $;
			return (
				($ = this._chainOrCallSubCommandHook($, B, "preSubcommand")),
				($ = this._chainOrCall($, () => {
					if (B._executableHandler) this._executeSubCommand(B, F.concat(_));
					else return B._parseCommand(F, _);
				})),
				$
			);
		}
		_dispatchHelpCommand(D) {
			if (!D) this.help();
			let F = this._findCommand(D);
			if (F && !F._executableHandler) F.help();
			return this._dispatchSubcommand(
				D,
				[],
				[
					this._getHelpOption()?.long ??
						this._getHelpOption()?.short ??
						"--help",
				],
			);
		}
		_checkNumberOfArguments() {
			if (
				(this.registeredArguments.forEach((D, F) => {
					if (D.required && this.args[F] == null)
						this.missingArgument(D.name());
				}),
				this.registeredArguments.length > 0 &&
					this.registeredArguments[this.registeredArguments.length - 1]
						.variadic)
			)
				return;
			if (this.args.length > this.registeredArguments.length)
				this._excessArguments(this.args);
		}
		_processArguments() {
			let D = (_, B, $) => {
				let Z = B;
				if (B !== null && _.parseArg) {
					let q = `error: command-argument value '${B}' is invalid for argument '${_.name()}'.`;
					Z = this._callParseArg(_, B, $, q);
				}
				return Z;
			};
			this._checkNumberOfArguments();
			let F = [];
			this.registeredArguments.forEach((_, B) => {
				let $ = _.defaultValue;
				if (_.variadic) {
					if (B < this.args.length) {
						if ((($ = this.args.slice(B)), _.parseArg))
							$ = $.reduce((Z, q) => {
								return D(_, q, Z);
							}, _.defaultValue);
					} else if ($ === void 0) $ = [];
				} else if (B < this.args.length) {
					if ((($ = this.args[B]), _.parseArg)) $ = D(_, $, _.defaultValue);
				}
				F[B] = $;
			}),
				(this.processedArgs = F);
		}
		_chainOrCall(D, F) {
			if (D && D.then && typeof D.then === "function") return D.then(() => F());
			return F();
		}
		_chainOrCallHooks(D, F) {
			let _ = D,
				B = [];
			if (
				(this._getCommandAndAncestors()
					.reverse()
					.filter(($) => $._lifeCycleHooks[F] !== void 0)
					.forEach(($) => {
						$._lifeCycleHooks[F].forEach((Z) => {
							B.push({ hookedCommand: $, callback: Z });
						});
					}),
				F === "postAction")
			)
				B.reverse();
			return (
				B.forEach(($) => {
					_ = this._chainOrCall(_, () => {
						return $.callback($.hookedCommand, this);
					});
				}),
				_
			);
		}
		_chainOrCallSubCommandHook(D, F, _) {
			let B = D;
			if (this._lifeCycleHooks[_] !== void 0)
				this._lifeCycleHooks[_].forEach(($) => {
					B = this._chainOrCall(B, () => {
						return $(this, F);
					});
				});
			return B;
		}
		_parseCommand(D, F) {
			let _ = this.parseOptions(F);
			if (
				(this._parseOptionsEnv(),
				this._parseOptionsImplied(),
				(D = D.concat(_.operands)),
				(F = _.unknown),
				(this.args = D.concat(F)),
				D && this._findCommand(D[0]))
			)
				return this._dispatchSubcommand(D[0], D.slice(1), F);
			if (this._getHelpCommand() && D[0] === this._getHelpCommand().name())
				return this._dispatchHelpCommand(D[1]);
			if (this._defaultCommandName)
				return (
					this._outputHelpIfRequested(F),
					this._dispatchSubcommand(this._defaultCommandName, D, F)
				);
			if (
				this.commands.length &&
				this.args.length === 0 &&
				!this._actionHandler &&
				!this._defaultCommandName
			)
				this.help({ error: !0 });
			this._outputHelpIfRequested(_.unknown),
				this._checkForMissingMandatoryOptions(),
				this._checkForConflictingOptions();
			let B = () => {
					if (_.unknown.length > 0) this.unknownOption(_.unknown[0]);
				},
				$ = `command:${this.name()}`;
			if (this._actionHandler) {
				B(), this._processArguments();
				let Z;
				if (
					((Z = this._chainOrCallHooks(Z, "preAction")),
					(Z = this._chainOrCall(Z, () =>
						this._actionHandler(this.processedArgs),
					)),
					this.parent)
				)
					Z = this._chainOrCall(Z, () => {
						this.parent.emit($, D, F);
					});
				return (Z = this._chainOrCallHooks(Z, "postAction")), Z;
			}
			if (this.parent && this.parent.listenerCount($))
				B(), this._processArguments(), this.parent.emit($, D, F);
			else if (D.length) {
				if (this._findCommand("*")) return this._dispatchSubcommand("*", D, F);
				if (this.listenerCount("command:*")) this.emit("command:*", D, F);
				else if (this.commands.length) this.unknownCommand();
				else B(), this._processArguments();
			} else if (this.commands.length) B(), this.help({ error: !0 });
			else B(), this._processArguments();
		}
		_findCommand(D) {
			if (!D) return;
			return this.commands.find((F) => F._name === D || F._aliases.includes(D));
		}
		_findOption(D) {
			return this.options.find((F) => F.is(D));
		}
		_checkForMissingMandatoryOptions() {
			this._getCommandAndAncestors().forEach((D) => {
				D.options.forEach((F) => {
					if (F.mandatory && D.getOptionValue(F.attributeName()) === void 0)
						D.missingMandatoryOptionValue(F);
				});
			});
		}
		_checkForConflictingLocalOptions() {
			let D = this.options.filter((_) => {
				let B = _.attributeName();
				if (this.getOptionValue(B) === void 0) return !1;
				return this.getOptionValueSource(B) !== "default";
			});
			D.filter((_) => _.conflictsWith.length > 0).forEach((_) => {
				let B = D.find(($) => _.conflictsWith.includes($.attributeName()));
				if (B) this._conflictingOption(_, B);
			});
		}
		_checkForConflictingOptions() {
			this._getCommandAndAncestors().forEach((D) => {
				D._checkForConflictingLocalOptions();
			});
		}
		parseOptions(D) {
			let F = [],
				_ = [],
				B = F,
				$ = D.slice();
			function Z(X) {
				return X.length > 1 && X[0] === "-";
			}
			let q = null;
			while ($.length) {
				let X = $.shift();
				if (X === "--") {
					if (B === _) B.push(X);
					B.push(...$);
					break;
				}
				if (q && !Z(X)) {
					this.emit(`option:${q.name()}`, X);
					continue;
				}
				if (((q = null), Z(X))) {
					let Q = this._findOption(X);
					if (Q) {
						if (Q.required) {
							let J = $.shift();
							if (J === void 0) this.optionMissingArgument(Q);
							this.emit(`option:${Q.name()}`, J);
						} else if (Q.optional) {
							let J = null;
							if ($.length > 0 && !Z($[0])) J = $.shift();
							this.emit(`option:${Q.name()}`, J);
						} else this.emit(`option:${Q.name()}`);
						q = Q.variadic ? Q : null;
						continue;
					}
				}
				if (X.length > 2 && X[0] === "-" && X[1] !== "-") {
					let Q = this._findOption(`-${X[1]}`);
					if (Q) {
						if (Q.required || (Q.optional && this._combineFlagAndOptionalValue))
							this.emit(`option:${Q.name()}`, X.slice(2));
						else this.emit(`option:${Q.name()}`), $.unshift(`-${X.slice(2)}`);
						continue;
					}
				}
				if (/^--[^=]+=/.test(X)) {
					let Q = X.indexOf("="),
						J = this._findOption(X.slice(0, Q));
					if (J && (J.required || J.optional)) {
						this.emit(`option:${J.name()}`, X.slice(Q + 1));
						continue;
					}
				}
				if (Z(X)) B = _;
				if (
					(this._enablePositionalOptions || this._passThroughOptions) &&
					F.length === 0 &&
					_.length === 0
				) {
					if (this._findCommand(X)) {
						if ((F.push(X), $.length > 0)) _.push(...$);
						break;
					} else if (
						this._getHelpCommand() &&
						X === this._getHelpCommand().name()
					) {
						if ((F.push(X), $.length > 0)) F.push(...$);
						break;
					} else if (this._defaultCommandName) {
						if ((_.push(X), $.length > 0)) _.push(...$);
						break;
					}
				}
				if (this._passThroughOptions) {
					if ((B.push(X), $.length > 0)) B.push(...$);
					break;
				}
				B.push(X);
			}
			return { operands: F, unknown: _ };
		}
		opts() {
			if (this._storeOptionsAsProperties) {
				let D = {},
					F = this.options.length;
				for (let _ = 0; _ < F; _++) {
					let B = this.options[_].attributeName();
					D[B] = B === this._versionOptionName ? this._version : this[B];
				}
				return D;
			}
			return this._optionValues;
		}
		optsWithGlobals() {
			return this._getCommandAndAncestors().reduce(
				(D, F) => Object.assign(D, F.opts()),
				{},
			);
		}
		error(D, F) {
			if (
				(this._outputConfiguration.outputError(
					`${D}
`,
					this._outputConfiguration.writeErr,
				),
				typeof this._showHelpAfterError === "string")
			)
				this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
			else if (this._showHelpAfterError)
				this._outputConfiguration.writeErr(`
`),
					this.outputHelp({ error: !0 });
			let _ = F || {},
				B = _.exitCode || 1,
				$ = _.code || "commander.error";
			this._exit(B, $, D);
		}
		_parseOptionsEnv() {
			this.options.forEach((D) => {
				if (D.envVar && D.envVar in S.env) {
					let F = D.attributeName();
					if (
						this.getOptionValue(F) === void 0 ||
						["default", "config", "env"].includes(this.getOptionValueSource(F))
					)
						if (D.required || D.optional)
							this.emit(`optionEnv:${D.name()}`, S.env[D.envVar]);
						else this.emit(`optionEnv:${D.name()}`);
				}
			});
		}
		_parseOptionsImplied() {
			let D = new _J(this.options),
				F = (_) => {
					return (
						this.getOptionValue(_) !== void 0 &&
						!["default", "implied"].includes(this.getOptionValueSource(_))
					);
				};
			this.options
				.filter(
					(_) =>
						_.implied !== void 0 &&
						F(_.attributeName()) &&
						D.valueFromOption(this.getOptionValue(_.attributeName()), _),
				)
				.forEach((_) => {
					Object.keys(_.implied)
						.filter((B) => !F(B))
						.forEach((B) => {
							this.setOptionValueWithSource(B, _.implied[B], "implied");
						});
				});
		}
		missingArgument(D) {
			let F = `error: missing required argument '${D}'`;
			this.error(F, { code: "commander.missingArgument" });
		}
		optionMissingArgument(D) {
			let F = `error: option '${D.flags}' argument missing`;
			this.error(F, { code: "commander.optionMissingArgument" });
		}
		missingMandatoryOptionValue(D) {
			let F = `error: required option '${D.flags}' not specified`;
			this.error(F, { code: "commander.missingMandatoryOptionValue" });
		}
		_conflictingOption(D, F) {
			let _ = (Z) => {
					let q = Z.attributeName(),
						X = this.getOptionValue(q),
						Q = this.options.find((z) => z.negate && q === z.attributeName()),
						J = this.options.find((z) => !z.negate && q === z.attributeName());
					if (
						Q &&
						((Q.presetArg === void 0 && X === !1) ||
							(Q.presetArg !== void 0 && X === Q.presetArg))
					)
						return Q;
					return J || Z;
				},
				B = (Z) => {
					let q = _(Z),
						X = q.attributeName();
					if (this.getOptionValueSource(X) === "env")
						return `environment variable '${q.envVar}'`;
					return `option '${q.flags}'`;
				},
				$ = `error: ${B(D)} cannot be used with ${B(F)}`;
			this.error($, { code: "commander.conflictingOption" });
		}
		unknownOption(D) {
			if (this._allowUnknownOption) return;
			let F = "";
			if (D.startsWith("--") && this._showSuggestionAfterError) {
				let B = [],
					$ = this;
				do {
					let Z = $.createHelp()
						.visibleOptions($)
						.filter((q) => q.long)
						.map((q) => q.long);
					(B = B.concat(Z)), ($ = $.parent);
				} while ($ && !$._enablePositionalOptions);
				F = k4(D, B);
			}
			let _ = `error: unknown option '${D}'${F}`;
			this.error(_, { code: "commander.unknownOption" });
		}
		_excessArguments(D) {
			if (this._allowExcessArguments) return;
			let F = this.registeredArguments.length,
				_ = F === 1 ? "" : "s",
				$ = `error: too many arguments${this.parent ? ` for '${this.name()}'` : ""}. Expected ${F} argument${_} but got ${D.length}.`;
			this.error($, { code: "commander.excessArguments" });
		}
		unknownCommand() {
			let D = this.args[0],
				F = "";
			if (this._showSuggestionAfterError) {
				let B = [];
				this.createHelp()
					.visibleCommands(this)
					.forEach(($) => {
						if ((B.push($.name()), $.alias())) B.push($.alias());
					}),
					(F = k4(D, B));
			}
			let _ = `error: unknown command '${D}'${F}`;
			this.error(_, { code: "commander.unknownCommand" });
		}
		version(D, F, _) {
			if (D === void 0) return this._version;
			(this._version = D),
				(F = F || "-V, --version"),
				(_ = _ || "output the version number");
			let B = this.createOption(F, _);
			return (
				(this._versionOptionName = B.attributeName()),
				this._registerOption(B),
				this.on("option:" + B.name(), () => {
					this._outputConfiguration.writeOut(`${D}
`),
						this._exit(0, "commander.version", D);
				}),
				this
			);
		}
		description(D, F) {
			if (D === void 0 && F === void 0) return this._description;
			if (((this._description = D), F)) this._argsDescription = F;
			return this;
		}
		summary(D) {
			if (D === void 0) return this._summary;
			return (this._summary = D), this;
		}
		alias(D) {
			if (D === void 0) return this._aliases[0];
			let F = this;
			if (
				this.commands.length !== 0 &&
				this.commands[this.commands.length - 1]._executableHandler
			)
				F = this.commands[this.commands.length - 1];
			if (D === F._name)
				throw new Error("Command alias can't be the same as its name");
			let _ = this.parent?._findCommand(D);
			if (_) {
				let B = [_.name()].concat(_.aliases()).join("|");
				throw new Error(
					`cannot add alias '${D}' to command '${this.name()}' as already have command '${B}'`,
				);
			}
			return F._aliases.push(D), this;
		}
		aliases(D) {
			if (D === void 0) return this._aliases;
			return D.forEach((F) => this.alias(F)), this;
		}
		usage(D) {
			if (D === void 0) {
				if (this._usage) return this._usage;
				let F = this.registeredArguments.map((_) => {
					return eQ(_);
				});
				return []
					.concat(
						this.options.length || this._helpOption !== null ? "[options]" : [],
						this.commands.length ? "[command]" : [],
						this.registeredArguments.length ? F : [],
					)
					.join(" ");
			}
			return (this._usage = D), this;
		}
		name(D) {
			if (D === void 0) return this._name;
			return (this._name = D), this;
		}
		nameFromFilename(D) {
			return (this._name = r0.basename(D, r0.extname(D))), this;
		}
		executableDir(D) {
			if (D === void 0) return this._executableDir;
			return (this._executableDir = D), this;
		}
		helpInformation(D) {
			let F = this.createHelp(),
				_ = this._getOutputContext(D);
			F.prepareContext({
				error: _.error,
				helpWidth: _.helpWidth,
				outputHasColors: _.hasColors,
			});
			let B = F.formatHelp(this, F);
			if (_.hasColors) return B;
			return this._outputConfiguration.stripColor(B);
		}
		_getOutputContext(D) {
			D = D || {};
			let F = !!D.error,
				_,
				B,
				$;
			if (F)
				(_ = (q) => this._outputConfiguration.writeErr(q)),
					(B = this._outputConfiguration.getErrHasColors()),
					($ = this._outputConfiguration.getErrHelpWidth());
			else
				(_ = (q) => this._outputConfiguration.writeOut(q)),
					(B = this._outputConfiguration.getOutHasColors()),
					($ = this._outputConfiguration.getOutHelpWidth());
			return {
				error: F,
				write: (q) => {
					if (!B) q = this._outputConfiguration.stripColor(q);
					return _(q);
				},
				hasColors: B,
				helpWidth: $,
			};
		}
		outputHelp(D) {
			let F;
			if (typeof D === "function") (F = D), (D = void 0);
			let _ = this._getOutputContext(D),
				B = { error: _.error, write: _.write, command: this };
			this._getCommandAndAncestors()
				.reverse()
				.forEach((Z) => Z.emit("beforeAllHelp", B)),
				this.emit("beforeHelp", B);
			let $ = this.helpInformation({ error: _.error });
			if (F) {
				if ((($ = F($)), typeof $ !== "string" && !Buffer.isBuffer($)))
					throw new Error(
						"outputHelp callback must return a string or a Buffer",
					);
			}
			if ((_.write($), this._getHelpOption()?.long))
				this.emit(this._getHelpOption().long);
			this.emit("afterHelp", B),
				this._getCommandAndAncestors().forEach((Z) =>
					Z.emit("afterAllHelp", B),
				);
		}
		helpOption(D, F) {
			if (typeof D === "boolean") {
				if (D) this._helpOption = this._helpOption ?? void 0;
				else this._helpOption = null;
				return this;
			}
			return (
				(D = D ?? "-h, --help"),
				(F = F ?? "display help for command"),
				(this._helpOption = this.createOption(D, F)),
				this
			);
		}
		_getHelpOption() {
			if (this._helpOption === void 0) this.helpOption(void 0, void 0);
			return this._helpOption;
		}
		addHelpOption(D) {
			return (this._helpOption = D), this;
		}
		help(D) {
			this.outputHelp(D);
			let F = Number(S.exitCode ?? 0);
			if (F === 0 && D && typeof D !== "function" && D.error) F = 1;
			this._exit(F, "commander.help", "(outputHelp)");
		}
		addHelpText(D, F) {
			let _ = ["beforeAll", "before", "after", "afterAll"];
			if (!_.includes(D))
				throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${_.join("', '")}'`);
			let B = `${D}Help`;
			return (
				this.on(B, ($) => {
					let Z;
					if (typeof F === "function")
						Z = F({ error: $.error, command: $.command });
					else Z = F;
					if (Z)
						$.write(`${Z}
`);
				}),
				this
			);
		}
		_outputHelpIfRequested(D) {
			let F = this._getHelpOption();
			if (F && D.find((B) => F.is(B)))
				this.outputHelp(),
					this._exit(0, "commander.helpDisplayed", "(outputHelp)");
		}
	}
	function f4(D) {
		return D.map((F) => {
			if (!F.startsWith("--inspect")) return F;
			let _,
				B = "127.0.0.1",
				$ = "9229",
				Z;
			if ((Z = F.match(/^(--inspect(-brk)?)$/)) !== null) _ = Z[1];
			else if ((Z = F.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null)
				if (((_ = Z[1]), /^\d+$/.test(Z[3]))) $ = Z[3];
				else B = Z[3];
			else if (
				(Z = F.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null
			)
				(_ = Z[1]), (B = Z[3]), ($ = Z[4]);
			if (_ && $ !== "0") return `${_}=${B}:${parseInt($) + 1}`;
			return F;
		});
	}
	function S8() {
		if (
			S.env.NO_COLOR ||
			S.env.FORCE_COLOR === "0" ||
			S.env.FORCE_COLOR === "false"
		)
			return !1;
		if (S.env.FORCE_COLOR || S.env.CLICOLOR_FORCE !== void 0) return !0;
		return;
	}
	BJ.Command = E8;
	BJ.useColor = S8;
});
var c4 = W((QJ) => {
	var { Argument: h4 } = qF(),
		{ Command: x8 } = m4(),
		{ CommanderError: ZJ, InvalidArgumentError: l4 } = n2(),
		{ Help: XJ } = w8(),
		{ Option: d4 } = j8();
	QJ.program = new x8();
	QJ.createCommand = (D) => new x8(D);
	QJ.createOption = (D, F) => new d4(D, F);
	QJ.createArgument = (D, F) => new h4(D, F);
	QJ.Command = x8;
	QJ.Option = d4;
	QJ.Argument = h4;
	QJ.Help = XJ;
	QJ.CommanderError = ZJ;
	QJ.InvalidArgumentError = l4;
	QJ.InvalidOptionArgumentError = l4;
});
var j = W((jJ) => {
	var g8 = Symbol.for("yaml.alias"),
		r4 = Symbol.for("yaml.document"),
		XF = Symbol.for("yaml.map"),
		n4 = Symbol.for("yaml.pair"),
		v8 = Symbol.for("yaml.scalar"),
		QF = Symbol.for("yaml.seq"),
		n0 = Symbol.for("yaml.node.type"),
		UJ = (D) => !!D && typeof D === "object" && D[n0] === g8,
		MJ = (D) => !!D && typeof D === "object" && D[n0] === r4,
		RJ = (D) => !!D && typeof D === "object" && D[n0] === XF,
		PJ = (D) => !!D && typeof D === "object" && D[n0] === n4,
		o4 = (D) => !!D && typeof D === "object" && D[n0] === v8,
		TJ = (D) => !!D && typeof D === "object" && D[n0] === QF;
	function t4(D) {
		if (D && typeof D === "object")
			switch (D[n0]) {
				case XF:
				case QF:
					return !0;
			}
		return !1;
	}
	function OJ(D) {
		if (D && typeof D === "object")
			switch (D[n0]) {
				case g8:
				case XF:
				case v8:
				case QF:
					return !0;
			}
		return !1;
	}
	var wJ = (D) => (o4(D) || t4(D)) && !!D.anchor;
	jJ.ALIAS = g8;
	jJ.DOC = r4;
	jJ.MAP = XF;
	jJ.NODE_TYPE = n0;
	jJ.PAIR = n4;
	jJ.SCALAR = v8;
	jJ.SEQ = QF;
	jJ.hasAnchor = wJ;
	jJ.isAlias = UJ;
	jJ.isCollection = t4;
	jJ.isDocument = MJ;
	jJ.isMap = RJ;
	jJ.isNode = OJ;
	jJ.isPair = PJ;
	jJ.isScalar = o4;
	jJ.isSeq = TJ;
});
var o2 = W((pJ) => {
	var i = j(),
		Q0 = Symbol("break visit"),
		e4 = Symbol("skip children"),
		y0 = Symbol("remove node");
	function JF(D, F) {
		let _ = D5(F);
		if (i.isDocument(D)) {
			if (z2(null, D.contents, _, Object.freeze([D])) === y0) D.contents = null;
		} else z2(null, D, _, Object.freeze([]));
	}
	JF.BREAK = Q0;
	JF.SKIP = e4;
	JF.REMOVE = y0;
	function z2(D, F, _, B) {
		let $ = F5(D, F, _, B);
		if (i.isNode($) || i.isPair($)) return _5(D, B, $), z2(D, $, _, B);
		if (typeof $ !== "symbol") {
			if (i.isCollection(F)) {
				B = Object.freeze(B.concat(F));
				for (let Z = 0; Z < F.items.length; ++Z) {
					let q = z2(Z, F.items[Z], _, B);
					if (typeof q === "number") Z = q - 1;
					else if (q === Q0) return Q0;
					else if (q === y0) F.items.splice(Z, 1), (Z -= 1);
				}
			} else if (i.isPair(F)) {
				B = Object.freeze(B.concat(F));
				let Z = z2("key", F.key, _, B);
				if (Z === Q0) return Q0;
				else if (Z === y0) F.key = null;
				let q = z2("value", F.value, _, B);
				if (q === Q0) return Q0;
				else if (q === y0) F.value = null;
			}
		}
		return $;
	}
	async function zF(D, F) {
		let _ = D5(F);
		if (i.isDocument(D)) {
			if ((await A2(null, D.contents, _, Object.freeze([D]))) === y0)
				D.contents = null;
		} else await A2(null, D, _, Object.freeze([]));
	}
	zF.BREAK = Q0;
	zF.SKIP = e4;
	zF.REMOVE = y0;
	async function A2(D, F, _, B) {
		let $ = await F5(D, F, _, B);
		if (i.isNode($) || i.isPair($)) return _5(D, B, $), A2(D, $, _, B);
		if (typeof $ !== "symbol") {
			if (i.isCollection(F)) {
				B = Object.freeze(B.concat(F));
				for (let Z = 0; Z < F.items.length; ++Z) {
					let q = await A2(Z, F.items[Z], _, B);
					if (typeof q === "number") Z = q - 1;
					else if (q === Q0) return Q0;
					else if (q === y0) F.items.splice(Z, 1), (Z -= 1);
				}
			} else if (i.isPair(F)) {
				B = Object.freeze(B.concat(F));
				let Z = await A2("key", F.key, _, B);
				if (Z === Q0) return Q0;
				else if (Z === y0) F.key = null;
				let q = await A2("value", F.value, _, B);
				if (q === Q0) return Q0;
				else if (q === y0) F.value = null;
			}
		}
		return $;
	}
	function D5(D) {
		if (typeof D === "object" && (D.Collection || D.Node || D.Value))
			return Object.assign(
				{ Alias: D.Node, Map: D.Node, Scalar: D.Node, Seq: D.Node },
				D.Value && { Map: D.Value, Scalar: D.Value, Seq: D.Value },
				D.Collection && { Map: D.Collection, Seq: D.Collection },
				D,
			);
		return D;
	}
	function F5(D, F, _, B) {
		if (typeof _ === "function") return _(D, F, B);
		if (i.isMap(F)) return _.Map?.(D, F, B);
		if (i.isSeq(F)) return _.Seq?.(D, F, B);
		if (i.isPair(F)) return _.Pair?.(D, F, B);
		if (i.isScalar(F)) return _.Scalar?.(D, F, B);
		if (i.isAlias(F)) return _.Alias?.(D, F, B);
		return;
	}
	function _5(D, F, _) {
		let B = F[F.length - 1];
		if (i.isCollection(B)) B.items[D] = _;
		else if (i.isPair(B))
			if (D === "key") B.key = _;
			else B.value = _;
		else if (i.isDocument(B)) B.contents = _;
		else {
			let $ = i.isAlias(B) ? "alias" : "scalar";
			throw new Error(`Cannot replace node with ${$} parent`);
		}
	}
	pJ.visit = JF;
	pJ.visitAsync = zF;
});
var y8 = W((oJ) => {
	var B5 = j(),
		sJ = o2(),
		rJ = {
			"!": "%21",
			",": "%2C",
			"[": "%5B",
			"]": "%5D",
			"{": "%7B",
			"}": "%7D",
		},
		nJ = (D) => D.replace(/[!,[\]{}]/g, (F) => rJ[F]);
	class H0 {
		constructor(D, F) {
			(this.docStart = null),
				(this.docEnd = !1),
				(this.yaml = Object.assign({}, H0.defaultYaml, D)),
				(this.tags = Object.assign({}, H0.defaultTags, F));
		}
		clone() {
			let D = new H0(this.yaml, this.tags);
			return (D.docStart = this.docStart), D;
		}
		atDocument() {
			let D = new H0(this.yaml, this.tags);
			switch (this.yaml.version) {
				case "1.1":
					this.atNextDocument = !0;
					break;
				case "1.2":
					(this.atNextDocument = !1),
						(this.yaml = { explicit: H0.defaultYaml.explicit, version: "1.2" }),
						(this.tags = Object.assign({}, H0.defaultTags));
					break;
			}
			return D;
		}
		add(D, F) {
			if (this.atNextDocument)
				(this.yaml = { explicit: H0.defaultYaml.explicit, version: "1.1" }),
					(this.tags = Object.assign({}, H0.defaultTags)),
					(this.atNextDocument = !1);
			let _ = D.trim().split(/[ \t]+/),
				B = _.shift();
			switch (B) {
				case "%TAG": {
					if (_.length !== 2) {
						if (
							(F(0, "%TAG directive should contain exactly two parts"),
							_.length < 2)
						)
							return !1;
					}
					let [$, Z] = _;
					return (this.tags[$] = Z), !0;
				}
				case "%YAML": {
					if (((this.yaml.explicit = !0), _.length !== 1))
						return F(0, "%YAML directive should contain exactly one part"), !1;
					let [$] = _;
					if ($ === "1.1" || $ === "1.2") return (this.yaml.version = $), !0;
					else {
						let Z = /^\d+\.\d+$/.test($);
						return F(6, `Unsupported YAML version ${$}`, Z), !1;
					}
				}
				default:
					return F(0, `Unknown directive ${B}`, !0), !1;
			}
		}
		tagName(D, F) {
			if (D === "!") return "!";
			if (D[0] !== "!") return F(`Not a valid tag: ${D}`), null;
			if (D[1] === "<") {
				let Z = D.slice(2, -1);
				if (Z === "!" || Z === "!!")
					return F(`Verbatim tags aren't resolved, so ${D} is invalid.`), null;
				if (D[D.length - 1] !== ">") F("Verbatim tags must end with a >");
				return Z;
			}
			let [, _, B] = D.match(/^(.*!)([^!]*)$/s);
			if (!B) F(`The ${D} tag has no suffix`);
			let $ = this.tags[_];
			if ($)
				try {
					return $ + decodeURIComponent(B);
				} catch (Z) {
					return F(String(Z)), null;
				}
			if (_ === "!") return D;
			return F(`Could not resolve tag: ${D}`), null;
		}
		tagString(D) {
			for (let [F, _] of Object.entries(this.tags))
				if (D.startsWith(_)) return F + nJ(D.substring(_.length));
			return D[0] === "!" ? D : `!<${D}>`;
		}
		toString(D) {
			let F = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [],
				_ = Object.entries(this.tags),
				B;
			if (D && _.length > 0 && B5.isNode(D.contents)) {
				let $ = {};
				sJ.visit(D.contents, (Z, q) => {
					if (B5.isNode(q) && q.tag) $[q.tag] = !0;
				}),
					(B = Object.keys($));
			} else B = [];
			for (let [$, Z] of _) {
				if ($ === "!!" && Z === "tag:yaml.org,2002:") continue;
				if (!D || B.some((q) => q.startsWith(Z))) F.push(`%TAG ${$} ${Z}`);
			}
			return F.join(`
`);
		}
	}
	H0.defaultYaml = { explicit: !1, version: "1.2" };
	H0.defaultTags = { "!!": "tag:yaml.org,2002:" };
	oJ.Directives = H0;
});
var AF = W((_z) => {
	var $5 = j(),
		eJ = o2();
	function Dz(D) {
		if (/[\x00-\x19\s,[\]{}]/.test(D)) {
			let _ = `Anchor must not contain whitespace or control characters: ${JSON.stringify(D)}`;
			throw new Error(_);
		}
		return !0;
	}
	function q5(D) {
		let F = new Set();
		return (
			eJ.visit(D, {
				Value(_, B) {
					if (B.anchor) F.add(B.anchor);
				},
			}),
			F
		);
	}
	function Z5(D, F) {
		for (let _ = 1; ; ++_) {
			let B = `${D}${_}`;
			if (!F.has(B)) return B;
		}
	}
	function Fz(D, F) {
		let _ = [],
			B = new Map(),
			$ = null;
		return {
			onAnchor: (Z) => {
				if ((_.push(Z), !$)) $ = q5(D);
				let q = Z5(F, $);
				return $.add(q), q;
			},
			setAnchors: () => {
				for (let Z of _) {
					let q = B.get(Z);
					if (
						typeof q === "object" &&
						q.anchor &&
						($5.isScalar(q.node) || $5.isCollection(q.node))
					)
						q.node.anchor = q.anchor;
					else {
						let X = new Error(
							"Failed to resolve repeated object (this should not happen)",
						);
						throw ((X.source = Z), X);
					}
				}
			},
			sourceObjects: B,
		};
	}
	_z.anchorIsValid = Dz;
	_z.anchorNames = q5;
	_z.createNodeAnchors = Fz;
	_z.findNewAnchor = Z5;
});
var k8 = W((Xz) => {
	function t2(D, F, _, B) {
		if (B && typeof B === "object")
			if (Array.isArray(B))
				for (let $ = 0, Z = B.length; $ < Z; ++$) {
					let q = B[$],
						X = t2(D, B, String($), q);
					if (X === void 0) delete B[$];
					else if (X !== q) B[$] = X;
				}
			else if (B instanceof Map)
				for (let $ of Array.from(B.keys())) {
					let Z = B.get($),
						q = t2(D, B, $, Z);
					if (q === void 0) B.delete($);
					else if (q !== Z) B.set($, q);
				}
			else if (B instanceof Set)
				for (let $ of Array.from(B)) {
					let Z = t2(D, B, $, $);
					if (Z === void 0) B.delete($);
					else if (Z !== $) B.delete($), B.add(Z);
				}
			else
				for (let [$, Z] of Object.entries(B)) {
					let q = t2(D, B, $, Z);
					if (q === void 0) delete B[$];
					else if (q !== Z) B[$] = q;
				}
		return D.call(F, _, B);
	}
	Xz.applyReviver = t2;
});
var HD = W((zz) => {
	var Jz = j();
	function X5(D, F, _) {
		if (Array.isArray(D)) return D.map((B, $) => X5(B, String($), _));
		if (D && typeof D.toJSON === "function") {
			if (!_ || !Jz.hasAnchor(D)) return D.toJSON(F, _);
			let B = { aliasCount: 0, count: 1, res: void 0 };
			_.anchors.set(D, B),
				(_.onCreate = (Z) => {
					(B.res = Z), delete _.onCreate;
				});
			let $ = D.toJSON(F, _);
			if (_.onCreate) _.onCreate($);
			return $;
		}
		if (typeof D === "bigint" && !_?.keep) return Number(D);
		return D;
	}
	zz.toJS = X5;
});
var LF = W((Vz) => {
	var Lz = k8(),
		Q5 = j(),
		Gz = HD();
	class J5 {
		constructor(D) {
			Object.defineProperty(this, Q5.NODE_TYPE, { value: D });
		}
		clone() {
			let D = Object.create(
				Object.getPrototypeOf(this),
				Object.getOwnPropertyDescriptors(this),
			);
			if (this.range) D.range = this.range.slice();
			return D;
		}
		toJS(D, { mapAsMap: F, maxAliasCount: _, onAnchor: B, reviver: $ } = {}) {
			if (!Q5.isDocument(D))
				throw new TypeError("A document argument is required");
			let Z = {
					anchors: new Map(),
					doc: D,
					keep: !0,
					mapAsMap: F === !0,
					mapKeyWarned: !1,
					maxAliasCount: typeof _ === "number" ? _ : 100,
				},
				q = Gz.toJS(this, "", Z);
			if (typeof B === "function")
				for (let { count: X, res: Q } of Z.anchors.values()) B(Q, X);
			return typeof $ === "function" ? Lz.applyReviver($, { "": q }, "", q) : q;
		}
	}
	Vz.NodeBase = J5;
});
var e2 = W((Yz) => {
	var Wz = AF(),
		z5 = o2(),
		GF = j(),
		Hz = LF(),
		Kz = HD();
	class A5 extends Hz.NodeBase {
		constructor(D) {
			super(GF.ALIAS);
			(this.source = D),
				Object.defineProperty(this, "tag", {
					set() {
						throw new Error("Alias nodes cannot have tags");
					},
				});
		}
		resolve(D) {
			let F = void 0;
			return (
				z5.visit(D, {
					Node: (_, B) => {
						if (B === this) return z5.visit.BREAK;
						if (B.anchor === this.source) F = B;
					},
				}),
				F
			);
		}
		toJSON(D, F) {
			if (!F) return { source: this.source };
			let { anchors: _, doc: B, maxAliasCount: $ } = F,
				Z = this.resolve(B);
			if (!Z) {
				let X = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
				throw new ReferenceError(X);
			}
			let q = _.get(Z);
			if (!q) Kz.toJS(Z, null, F), (q = _.get(Z));
			if (!q || q.res === void 0)
				throw new ReferenceError(
					"This should not happen: Alias anchor was not resolved?",
				);
			if ($ >= 0) {
				if (((q.count += 1), q.aliasCount === 0)) q.aliasCount = VF(B, Z, _);
				if (q.count * q.aliasCount > $)
					throw new ReferenceError(
						"Excessive alias count indicates a resource exhaustion attack",
					);
			}
			return q.res;
		}
		toString(D, F, _) {
			let B = `*${this.source}`;
			if (D) {
				if (
					(Wz.anchorIsValid(this.source),
					D.options.verifyAliasOrder && !D.anchors.has(this.source))
				) {
					let $ = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
					throw new Error($);
				}
				if (D.implicitKey) return `${B} `;
			}
			return B;
		}
	}
	function VF(D, F, _) {
		if (GF.isAlias(F)) {
			let B = F.resolve(D),
				$ = _ && B && _.get(B);
			return $ ? $.count * $.aliasCount : 0;
		} else if (GF.isCollection(F)) {
			let B = 0;
			for (let $ of F.items) {
				let Z = VF(D, $, _);
				if (Z > B) B = Z;
			}
			return B;
		} else if (GF.isPair(F)) {
			let B = VF(D, F.key, _),
				$ = VF(D, F.value, _);
			return Math.max(B, $);
		}
		return 1;
	}
	Yz.Alias = A5;
});
var p = W((Tz) => {
	var Uz = j(),
		Mz = LF(),
		Rz = HD(),
		Pz = (D) => !D || (typeof D !== "function" && typeof D !== "object");
	class lD extends Mz.NodeBase {
		constructor(D) {
			super(Uz.SCALAR);
			this.value = D;
		}
		toJSON(D, F) {
			return F?.keep ? this.value : Rz.toJS(this.value, D, F);
		}
		toString() {
			return String(this.value);
		}
	}
	lD.BLOCK_FOLDED = "BLOCK_FOLDED";
	lD.BLOCK_LITERAL = "BLOCK_LITERAL";
	lD.PLAIN = "PLAIN";
	lD.QUOTE_DOUBLE = "QUOTE_DOUBLE";
	lD.QUOTE_SINGLE = "QUOTE_SINGLE";
	Tz.Scalar = lD;
	Tz.isScalarValue = Pz;
});
var D1 = W((Ez) => {
	var jz = e2(),
		dD = j(),
		L5 = p(),
		uz = "tag:yaml.org,2002:";
	function Nz(D, F, _) {
		if (F) {
			let B = _.filter((Z) => Z.tag === F),
				$ = B.find((Z) => !Z.format) ?? B[0];
			if (!$) throw new Error(`Tag ${F} not found`);
			return $;
		}
		return _.find((B) => B.identify?.(D) && !B.format);
	}
	function Sz(D, F, _) {
		if (dD.isDocument(D)) D = D.contents;
		if (dD.isNode(D)) return D;
		if (dD.isPair(D)) {
			let A = _.schema[dD.MAP].createNode?.(_.schema, null, _);
			return A.items.push(D), A;
		}
		if (
			D instanceof String ||
			D instanceof Number ||
			D instanceof Boolean ||
			(typeof BigInt !== "undefined" && D instanceof BigInt)
		)
			D = D.valueOf();
		let {
				aliasDuplicateObjects: B,
				onAnchor: $,
				onTagObj: Z,
				schema: q,
				sourceObjects: X,
			} = _,
			Q = void 0;
		if (B && D && typeof D === "object")
			if (((Q = X.get(D)), Q)) {
				if (!Q.anchor) Q.anchor = $(D);
				return new jz.Alias(Q.anchor);
			} else (Q = { anchor: null, node: null }), X.set(D, Q);
		if (F?.startsWith("!!")) F = uz + F.slice(2);
		let J = Nz(D, F, q.tags);
		if (!J) {
			if (D && typeof D.toJSON === "function") D = D.toJSON();
			if (!D || typeof D !== "object") {
				let A = new L5.Scalar(D);
				if (Q) Q.node = A;
				return A;
			}
			J =
				D instanceof Map
					? q[dD.MAP]
					: Symbol.iterator in Object(D)
						? q[dD.SEQ]
						: q[dD.MAP];
		}
		if (Z) Z(J), delete _.onTagObj;
		let z = J?.createNode
			? J.createNode(_.schema, D, _)
			: typeof J?.nodeClass?.from === "function"
				? J.nodeClass.from(_.schema, D, _)
				: new L5.Scalar(D);
		if (F) z.tag = F;
		else if (!J.default) z.tag = J.tag;
		if (Q) Q.node = z;
		return z;
	}
	Ez.createNode = Sz;
});
var CF = W((vz) => {
	var bz = D1(),
		k0 = j(),
		gz = LF();
	function f8(D, F, _) {
		let B = _;
		for (let $ = F.length - 1; $ >= 0; --$) {
			let Z = F[$];
			if (typeof Z === "number" && Number.isInteger(Z) && Z >= 0) {
				let q = [];
				(q[Z] = B), (B = q);
			} else B = new Map([[Z, B]]);
		}
		return bz.createNode(B, void 0, {
			aliasDuplicateObjects: !1,
			keepUndefined: !1,
			onAnchor: () => {
				throw new Error("This should not happen, please report a bug.");
			},
			schema: D,
			sourceObjects: new Map(),
		});
	}
	var G5 = (D) =>
		D == null || (typeof D === "object" && !!D[Symbol.iterator]().next().done);
	class V5 extends gz.NodeBase {
		constructor(D, F) {
			super(D);
			Object.defineProperty(this, "schema", {
				value: F,
				configurable: !0,
				enumerable: !1,
				writable: !0,
			});
		}
		clone(D) {
			let F = Object.create(
				Object.getPrototypeOf(this),
				Object.getOwnPropertyDescriptors(this),
			);
			if (D) F.schema = D;
			if (
				((F.items = F.items.map((_) =>
					k0.isNode(_) || k0.isPair(_) ? _.clone(D) : _,
				)),
				this.range)
			)
				F.range = this.range.slice();
			return F;
		}
		addIn(D, F) {
			if (G5(D)) this.add(F);
			else {
				let [_, ...B] = D,
					$ = this.get(_, !0);
				if (k0.isCollection($)) $.addIn(B, F);
				else if ($ === void 0 && this.schema)
					this.set(_, f8(this.schema, B, F));
				else
					throw new Error(
						`Expected YAML collection at ${_}. Remaining path: ${B}`,
					);
			}
		}
		deleteIn(D) {
			let [F, ..._] = D;
			if (_.length === 0) return this.delete(F);
			let B = this.get(F, !0);
			if (k0.isCollection(B)) return B.deleteIn(_);
			else
				throw new Error(
					`Expected YAML collection at ${F}. Remaining path: ${_}`,
				);
		}
		getIn(D, F) {
			let [_, ...B] = D,
				$ = this.get(_, !0);
			if (B.length === 0) return !F && k0.isScalar($) ? $.value : $;
			else return k0.isCollection($) ? $.getIn(B, F) : void 0;
		}
		hasAllNullValues(D) {
			return this.items.every((F) => {
				if (!k0.isPair(F)) return !1;
				let _ = F.value;
				return (
					_ == null ||
					(D &&
						k0.isScalar(_) &&
						_.value == null &&
						!_.commentBefore &&
						!_.comment &&
						!_.tag)
				);
			});
		}
		hasIn(D) {
			let [F, ..._] = D;
			if (_.length === 0) return this.has(F);
			let B = this.get(F, !0);
			return k0.isCollection(B) ? B.hasIn(_) : !1;
		}
		setIn(D, F) {
			let [_, ...B] = D;
			if (B.length === 0) this.set(_, F);
			else {
				let $ = this.get(_, !0);
				if (k0.isCollection($)) $.setIn(B, F);
				else if ($ === void 0 && this.schema)
					this.set(_, f8(this.schema, B, F));
				else
					throw new Error(
						`Expected YAML collection at ${_}. Remaining path: ${B}`,
					);
			}
		}
	}
	vz.Collection = V5;
	vz.collectionFromPath = f8;
	vz.isEmptyPath = G5;
});
var F1 = W((lz) => {
	var mz = (D) => D.replace(/^(?!$)(?: $)?/gm, "#");
	function m8(D, F) {
		if (/^\n+$/.test(D)) return D.substring(1);
		return F ? D.replace(/^(?! *$)/gm, F) : D;
	}
	var hz = (D, F, _) =>
		D.endsWith(`
`)
			? m8(_, F)
			: _.includes(`
`)
				? `
` + m8(_, F)
				: (D.endsWith(" ") ? "" : " ") + _;
	lz.indentComment = m8;
	lz.lineComment = hz;
	lz.stringifyComment = mz;
});
var W5 = W((iz) => {
	function az(
		D,
		F,
		_ = "flow",
		{
			indentAtStart: B,
			lineWidth: $ = 80,
			minContentWidth: Z = 20,
			onFold: q,
			onOverflow: X,
		} = {},
	) {
		if (!$ || $ < 0) return D;
		if ($ < Z) Z = 0;
		let Q = Math.max(1 + Z, 1 + $ - F.length);
		if (D.length <= Q) return D;
		let J = [],
			z = {},
			A = $ - F.length;
		if (typeof B === "number")
			if (B > $ - Math.max(2, Z)) J.push(0);
			else A = $ - B;
		let L = void 0,
			G = void 0,
			H = !1,
			V = -1,
			C = -1,
			K = -1;
		if (_ === "block") {
			if (((V = C5(D, V, F.length)), V !== -1)) A = V + Q;
		}
		for (let M; (M = D[(V += 1)]); ) {
			if (_ === "quoted" && M === "\\") {
				switch (((C = V), D[V + 1])) {
					case "x":
						V += 3;
						break;
					case "u":
						V += 5;
						break;
					case "U":
						V += 9;
						break;
					default:
						V += 1;
				}
				K = V;
			}
			if (
				M ===
				`
`
			) {
				if (_ === "block") V = C5(D, V, F.length);
				(A = V + F.length + Q), (L = void 0);
			} else {
				if (
					M === " " &&
					G &&
					G !== " " &&
					G !==
						`
` &&
					G !== "\t"
				) {
					let P = D[V + 1];
					if (
						P &&
						P !== " " &&
						P !==
							`
` &&
						P !== "\t"
					)
						L = V;
				}
				if (V >= A)
					if (L) J.push(L), (A = L + Q), (L = void 0);
					else if (_ === "quoted") {
						while (G === " " || G === "\t")
							(G = M), (M = D[(V += 1)]), (H = !0);
						let P = V > K + 1 ? V - 2 : C - 1;
						if (z[P]) return D;
						J.push(P), (z[P] = !0), (A = P + Q), (L = void 0);
					} else H = !0;
			}
			G = M;
		}
		if (H && X) X();
		if (J.length === 0) return D;
		if (q) q();
		let I = D.slice(0, J[0]);
		for (let M = 0; M < J.length; ++M) {
			let P = J[M],
				O = J[M + 1] || D.length;
			if (P === 0)
				I = `
${F}${D.slice(0, O)}`;
			else {
				if (_ === "quoted" && z[P]) I += `${D[P]}\\`;
				I += `
${F}${D.slice(P + 1, O)}`;
			}
		}
		return I;
	}
	function C5(D, F, _) {
		let B = F,
			$ = F + 1,
			Z = D[$];
		while (Z === " " || Z === "\t")
			if (F < $ + _) Z = D[++F];
			else {
				do Z = D[++F];
				while (
					Z &&
					Z !==
						`
`
				);
				(B = F), ($ = F + 1), (Z = D[$]);
			}
		return B;
	}
	iz.FOLD_BLOCK = "block";
	iz.FOLD_FLOW = "flow";
	iz.FOLD_QUOTED = "quoted";
	iz.foldFlowLines = az;
});
var B1 = W((FA) => {
	var O0 = p(),
		KD = W5(),
		HF = (D, F) => ({
			indentAtStart: F ? D.indent.length : D.indentAtStart,
			lineWidth: D.options.lineWidth,
			minContentWidth: D.options.minContentWidth,
		}),
		KF = (D) => /^(%|---|\.\.\.)/m.test(D);
	function tz(D, F, _) {
		if (!F || F < 0) return !1;
		let B = F - _,
			$ = D.length;
		if ($ <= B) return !1;
		for (let Z = 0, q = 0; Z < $; ++Z)
			if (
				D[Z] ===
				`
`
			) {
				if (Z - q > B) return !0;
				if (((q = Z + 1), $ - q <= B)) return !1;
			}
		return !0;
	}
	function _1(D, F) {
		let _ = JSON.stringify(D);
		if (F.options.doubleQuotedAsJSON) return _;
		let { implicitKey: B } = F,
			$ = F.options.doubleQuotedMinMultiLineLength,
			Z = F.indent || (KF(D) ? "  " : ""),
			q = "",
			X = 0;
		for (let Q = 0, J = _[Q]; J; J = _[++Q]) {
			if (J === " " && _[Q + 1] === "\\" && _[Q + 2] === "n")
				(q += _.slice(X, Q) + "\\ "), (Q += 1), (X = Q), (J = "\\");
			if (J === "\\")
				switch (_[Q + 1]) {
					case "u":
						{
							q += _.slice(X, Q);
							let z = _.substr(Q + 2, 4);
							switch (z) {
								case "0000":
									q += "\\0";
									break;
								case "0007":
									q += "\\a";
									break;
								case "000b":
									q += "\\v";
									break;
								case "001b":
									q += "\\e";
									break;
								case "0085":
									q += "\\N";
									break;
								case "00a0":
									q += "\\_";
									break;
								case "2028":
									q += "\\L";
									break;
								case "2029":
									q += "\\P";
									break;
								default:
									if (z.substr(0, 2) === "00") q += "\\x" + z.substr(2);
									else q += _.substr(Q, 6);
							}
							(Q += 5), (X = Q + 1);
						}
						break;
					case "n":
						if (B || _[Q + 2] === '"' || _.length < $) Q += 1;
						else {
							q +=
								_.slice(X, Q) +
								`

`;
							while (_[Q + 2] === "\\" && _[Q + 3] === "n" && _[Q + 4] !== '"')
								(q += `
`),
									(Q += 2);
							if (((q += Z), _[Q + 2] === " ")) q += "\\";
							(Q += 1), (X = Q + 1);
						}
						break;
					default:
						Q += 1;
				}
		}
		return (
			(q = X ? q + _.slice(X) : _),
			B ? q : KD.foldFlowLines(q, Z, KD.FOLD_QUOTED, HF(F, !1))
		);
	}
	function h8(D, F) {
		if (
			F.options.singleQuote === !1 ||
			(F.implicitKey &&
				D.includes(`
`)) ||
			/[ \t]\n|\n[ \t]/.test(D)
		)
			return _1(D, F);
		let _ = F.indent || (KF(D) ? "  " : ""),
			B =
				"'" +
				D.replace(/'/g, "''").replace(
					/\n+/g,
					`$&
${_}`,
				) +
				"'";
		return F.implicitKey ? B : KD.foldFlowLines(B, _, KD.FOLD_FLOW, HF(F, !1));
	}
	function L2(D, F) {
		let { singleQuote: _ } = F.options,
			B;
		if (_ === !1) B = _1;
		else {
			let $ = D.includes('"'),
				Z = D.includes("'");
			if ($ && !Z) B = h8;
			else if (Z && !$) B = _1;
			else B = _ ? h8 : _1;
		}
		return B(D, F);
	}
	var l8;
	try {
		l8 = new RegExp(
			`(^|(?<!
))
+(?!
|$)`,
			"g",
		);
	} catch {
		l8 = /\n+(?!\n|$)/g;
	}
	function WF({ comment: D, type: F, value: _ }, B, $, Z) {
		let { blockQuote: q, commentString: X, lineWidth: Q } = B.options;
		if (!q || /\n[\t ]+$/.test(_) || /^\s*$/.test(_)) return L2(_, B);
		let J = B.indent || (B.forceBlockIndent || KF(_) ? "  " : ""),
			z =
				q === "literal"
					? !0
					: q === "folded" || F === O0.Scalar.BLOCK_FOLDED
						? !1
						: F === O0.Scalar.BLOCK_LITERAL
							? !0
							: !tz(_, Q, J.length);
		if (!_)
			return z
				? `|
`
				: `>
`;
		let A, L;
		for (L = _.length; L > 0; --L) {
			let O = _[L - 1];
			if (
				O !==
					`
` &&
				O !== "\t" &&
				O !== " "
			)
				break;
		}
		let G = _.substring(L),
			H = G.indexOf(`
`);
		if (H === -1) A = "-";
		else if (_ === G || H !== G.length - 1) {
			if (((A = "+"), Z)) Z();
		} else A = "";
		if (G) {
			if (
				((_ = _.slice(0, -G.length)),
				G[G.length - 1] ===
					`
`)
			)
				G = G.slice(0, -1);
			G = G.replace(l8, `$&${J}`);
		}
		let V = !1,
			C,
			K = -1;
		for (C = 0; C < _.length; ++C) {
			let O = _[C];
			if (O === " ") V = !0;
			else if (
				O ===
				`
`
			)
				K = C;
			else break;
		}
		let I = _.substring(0, K < C ? K + 1 : C);
		if (I) (_ = _.substring(I.length)), (I = I.replace(/\n+/g, `$&${J}`));
		let P = (V ? (J ? "2" : "1") : "") + A;
		if (D) {
			if (((P += " " + X(D.replace(/ ?[\r\n]+/g, " "))), $)) $();
		}
		if (!z) {
			let O = _.replace(
					/\n+/g,
					`
$&`,
				)
					.replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2")
					.replace(/\n+/g, `$&${J}`),
				w = !1,
				x = HF(B, !0);
			if (q !== "folded" && F !== O0.Scalar.BLOCK_FOLDED)
				x.onOverflow = () => {
					w = !0;
				};
			let Y = KD.foldFlowLines(`${I}${O}${G}`, J, KD.FOLD_BLOCK, x);
			if (!w)
				return `>${P}
${J}${Y}`;
		}
		return (
			(_ = _.replace(/\n+/g, `$&${J}`)),
			`|${P}
${J}${I}${_}${G}`
		);
	}
	function ez(D, F, _, B) {
		let { type: $, value: Z } = D,
			{
				actualString: q,
				implicitKey: X,
				indent: Q,
				indentStep: J,
				inFlow: z,
			} = F;
		if (
			(X &&
				Z.includes(`
`)) ||
			(z && /[[\]{},]/.test(Z))
		)
			return L2(Z, F);
		if (
			!Z ||
			/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(
				Z,
			)
		)
			return X ||
				z ||
				!Z.includes(`
`)
				? L2(Z, F)
				: WF(D, F, _, B);
		if (
			!X &&
			!z &&
			$ !== O0.Scalar.PLAIN &&
			Z.includes(`
`)
		)
			return WF(D, F, _, B);
		if (KF(Z)) {
			if (Q === "") return (F.forceBlockIndent = !0), WF(D, F, _, B);
			else if (X && Q === J) return L2(Z, F);
		}
		let A = Z.replace(
			/\n+/g,
			`$&
${Q}`,
		);
		if (q) {
			let L = (V) =>
					V.default && V.tag !== "tag:yaml.org,2002:str" && V.test?.test(A),
				{ compat: G, tags: H } = F.doc.schema;
			if (H.some(L) || G?.some(L)) return L2(Z, F);
		}
		return X ? A : KD.foldFlowLines(A, Q, KD.FOLD_FLOW, HF(F, !1));
	}
	function DA(D, F, _, B) {
		let { implicitKey: $, inFlow: Z } = F,
			q =
				typeof D.value === "string"
					? D
					: Object.assign({}, D, { value: String(D.value) }),
			{ type: X } = D;
		if (X !== O0.Scalar.QUOTE_DOUBLE) {
			if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(q.value))
				X = O0.Scalar.QUOTE_DOUBLE;
		}
		let Q = (z) => {
				switch (z) {
					case O0.Scalar.BLOCK_FOLDED:
					case O0.Scalar.BLOCK_LITERAL:
						return $ || Z ? L2(q.value, F) : WF(q, F, _, B);
					case O0.Scalar.QUOTE_DOUBLE:
						return _1(q.value, F);
					case O0.Scalar.QUOTE_SINGLE:
						return h8(q.value, F);
					case O0.Scalar.PLAIN:
						return ez(q, F, _, B);
					default:
						return null;
				}
			},
			J = Q(X);
		if (J === null) {
			let { defaultKeyType: z, defaultStringType: A } = F.options,
				L = ($ && z) || A;
			if (((J = Q(L)), J === null))
				throw new Error(`Unsupported default string type ${L}`);
		}
		return J;
	}
	FA.stringifyString = DA;
});
var $1 = W((zA) => {
	var BA = AF(),
		YD = j(),
		$A = F1(),
		qA = B1();
	function ZA(D, F) {
		let _ = Object.assign(
				{
					blockQuote: !0,
					commentString: $A.stringifyComment,
					defaultKeyType: null,
					defaultStringType: "PLAIN",
					directives: null,
					doubleQuotedAsJSON: !1,
					doubleQuotedMinMultiLineLength: 40,
					falseStr: "false",
					flowCollectionPadding: !0,
					indentSeq: !0,
					lineWidth: 80,
					minContentWidth: 20,
					nullStr: "null",
					simpleKeys: !1,
					singleQuote: null,
					trueStr: "true",
					verifyAliasOrder: !0,
				},
				D.schema.toStringOptions,
				F,
			),
			B;
		switch (_.collectionStyle) {
			case "block":
				B = !1;
				break;
			case "flow":
				B = !0;
				break;
			default:
				B = null;
		}
		return {
			anchors: new Set(),
			doc: D,
			flowCollectionPadding: _.flowCollectionPadding ? " " : "",
			indent: "",
			indentStep: typeof _.indent === "number" ? " ".repeat(_.indent) : "  ",
			inFlow: B,
			options: _,
		};
	}
	function XA(D, F) {
		if (F.tag) {
			let $ = D.filter((Z) => Z.tag === F.tag);
			if ($.length > 0) return $.find((Z) => Z.format === F.format) ?? $[0];
		}
		let _ = void 0,
			B;
		if (YD.isScalar(F)) {
			B = F.value;
			let $ = D.filter((Z) => Z.identify?.(B));
			if ($.length > 1) {
				let Z = $.filter((q) => q.test);
				if (Z.length > 0) $ = Z;
			}
			_ = $.find((Z) => Z.format === F.format) ?? $.find((Z) => !Z.format);
		} else
			(B = F), (_ = D.find(($) => $.nodeClass && B instanceof $.nodeClass));
		if (!_) {
			let $ = B?.constructor?.name ?? typeof B;
			throw new Error(`Tag not resolved for ${$} value`);
		}
		return _;
	}
	function QA(D, F, { anchors: _, doc: B }) {
		if (!B.directives) return "";
		let $ = [],
			Z = (YD.isScalar(D) || YD.isCollection(D)) && D.anchor;
		if (Z && BA.anchorIsValid(Z)) _.add(Z), $.push(`&${Z}`);
		let q = D.tag ? D.tag : F.default ? null : F.tag;
		if (q) $.push(B.directives.tagString(q));
		return $.join(" ");
	}
	function JA(D, F, _, B) {
		if (YD.isPair(D)) return D.toString(F, _, B);
		if (YD.isAlias(D)) {
			if (F.doc.directives) return D.toString(F);
			if (F.resolvedAliases?.has(D))
				throw new TypeError(
					"Cannot stringify circular structure without alias nodes",
				);
			else {
				if (F.resolvedAliases) F.resolvedAliases.add(D);
				else F.resolvedAliases = new Set([D]);
				D = D.resolve(F.doc);
			}
		}
		let $ = void 0,
			Z = YD.isNode(D) ? D : F.doc.createNode(D, { onTagObj: (Q) => ($ = Q) });
		if (!$) $ = XA(F.doc.schema.tags, Z);
		let q = QA(Z, $, F);
		if (q.length > 0) F.indentAtStart = (F.indentAtStart ?? 0) + q.length + 1;
		let X =
			typeof $.stringify === "function"
				? $.stringify(Z, F, _, B)
				: YD.isScalar(Z)
					? qA.stringifyString(Z, F, _, B)
					: Z.toString(F, _, B);
		if (!q) return X;
		return YD.isScalar(Z) || X[0] === "{" || X[0] === "["
			? `${q} ${X}`
			: `${q}
${F.indent}${X}`;
	}
	zA.createStringifyContext = ZA;
	zA.stringify = JA;
});
var Y5 = W((VA) => {
	var o0 = j(),
		H5 = p(),
		K5 = $1(),
		q1 = F1();
	function GA({ key: D, value: F }, _, B, $) {
		let {
				allNullValues: Z,
				doc: q,
				indent: X,
				indentStep: Q,
				options: { commentString: J, indentSeq: z, simpleKeys: A },
			} = _,
			L = (o0.isNode(D) && D.comment) || null;
		if (A) {
			if (L)
				throw new Error("With simple keys, key nodes cannot have comments");
			if (o0.isCollection(D) || (!o0.isNode(D) && typeof D === "object"))
				throw new Error(
					"With simple keys, collection cannot be used as a key value",
				);
		}
		let G =
			!A &&
			(!D ||
				(L && F == null && !_.inFlow) ||
				o0.isCollection(D) ||
				(o0.isScalar(D)
					? D.type === H5.Scalar.BLOCK_FOLDED ||
						D.type === H5.Scalar.BLOCK_LITERAL
					: typeof D === "object"));
		_ = Object.assign({}, _, {
			allNullValues: !1,
			implicitKey: !G && (A || !Z),
			indent: X + Q,
		});
		let H = !1,
			V = !1,
			C = K5.stringify(
				D,
				_,
				() => (H = !0),
				() => (V = !0),
			);
		if (!G && !_.inFlow && C.length > 1024) {
			if (A)
				throw new Error(
					"With simple keys, single line scalar must not span more than 1024 characters",
				);
			G = !0;
		}
		if (_.inFlow) {
			if (Z || F == null) {
				if (H && B) B();
				return C === "" ? "?" : G ? `? ${C}` : C;
			}
		} else if ((Z && !A) || (F == null && G)) {
			if (((C = `? ${C}`), L && !H)) C += q1.lineComment(C, _.indent, J(L));
			else if (V && $) $();
			return C;
		}
		if (H) L = null;
		if (G) {
			if (L) C += q1.lineComment(C, _.indent, J(L));
			C = `? ${C}
${X}:`;
		} else if (((C = `${C}:`), L)) C += q1.lineComment(C, _.indent, J(L));
		let K, I, M;
		if (o0.isNode(F))
			(K = !!F.spaceBefore), (I = F.commentBefore), (M = F.comment);
		else if (((K = !1), (I = null), (M = null), F && typeof F === "object"))
			F = q.createNode(F);
		if (((_.implicitKey = !1), !G && !L && o0.isScalar(F)))
			_.indentAtStart = C.length + 1;
		if (
			((V = !1),
			!z &&
				Q.length >= 2 &&
				!_.inFlow &&
				!G &&
				o0.isSeq(F) &&
				!F.flow &&
				!F.tag &&
				!F.anchor)
		)
			_.indent = _.indent.substring(2);
		let P = !1,
			O = K5.stringify(
				F,
				_,
				() => (P = !0),
				() => (V = !0),
			),
			w = " ";
		if (L || K || I) {
			if (
				((w = K
					? `
`
					: ""),
				I)
			) {
				let x = J(I);
				w += `
${q1.indentComment(x, _.indent)}`;
			}
			if (O === "" && !_.inFlow) {
				if (
					w ===
					`
`
				)
					w = `

`;
			} else
				w += `
${_.indent}`;
		} else if (!G && o0.isCollection(F)) {
			let x = O[0],
				Y = O.indexOf(`
`),
				y = Y !== -1,
				b0 = _.inFlow ?? F.flow ?? F.items.length === 0;
			if (y || !b0) {
				let WD = !1;
				if (y && (x === "&" || x === "!")) {
					let a = O.indexOf(" ");
					if (x === "&" && a !== -1 && a < Y && O[a + 1] === "!")
						a = O.indexOf(" ", a + 1);
					if (a === -1 || Y < a) WD = !0;
				}
				if (!WD)
					w = `
${_.indent}`;
			}
		} else if (
			O === "" ||
			O[0] ===
				`
`
		)
			w = "";
		if (((C += w + O), _.inFlow)) {
			if (P && B) B();
		} else if (M && !P) C += q1.lineComment(C, _.indent, J(M));
		else if (V && $) $();
		return C;
	}
	VA.stringifyPair = GA;
});
var d8 = W((KA) => {
	var I5 = R("process");
	function WA(D, ...F) {
		if (D === "debug") console.log(...F);
	}
	function HA(D, F) {
		if (D === "debug" || D === "warn")
			if (typeof I5.emitWarning === "function") I5.emitWarning(F);
			else console.warn(F);
	}
	KA.debug = WA;
	KA.warn = HA;
});
var UF = W((MA) => {
	var Z1 = j(),
		U5 = p(),
		YF = "<<",
		IF = {
			identify: (D) =>
				D === YF || (typeof D === "symbol" && D.description === YF),
			default: "key",
			tag: "tag:yaml.org,2002:merge",
			test: /^<<$/,
			resolve: () =>
				Object.assign(new U5.Scalar(Symbol(YF)), { addToJSMap: M5 }),
			stringify: () => YF,
		},
		UA = (D, F) =>
			(IF.identify(F) ||
				(Z1.isScalar(F) &&
					(!F.type || F.type === U5.Scalar.PLAIN) &&
					IF.identify(F.value))) &&
			D?.doc.schema.tags.some((_) => _.tag === IF.tag && _.default);
	function M5(D, F, _) {
		if (((_ = D && Z1.isAlias(_) ? _.resolve(D.doc) : _), Z1.isSeq(_)))
			for (let B of _.items) c8(D, F, B);
		else if (Array.isArray(_)) for (let B of _) c8(D, F, B);
		else c8(D, F, _);
	}
	function c8(D, F, _) {
		let B = D && Z1.isAlias(_) ? _.resolve(D.doc) : _;
		if (!Z1.isMap(B))
			throw new Error("Merge sources must be maps or map aliases");
		let $ = B.toJSON(null, D, Map);
		for (let [Z, q] of $)
			if (F instanceof Map) {
				if (!F.has(Z)) F.set(Z, q);
			} else if (F instanceof Set) F.add(Z);
			else if (!Object.prototype.hasOwnProperty.call(F, Z))
				Object.defineProperty(F, Z, {
					value: q,
					writable: !0,
					enumerable: !0,
					configurable: !0,
				});
		return F;
	}
	MA.addMergeToJSMap = M5;
	MA.isMergeKey = UA;
	MA.merge = IF;
});
var a8 = W((NA) => {
	var OA = d8(),
		R5 = UF(),
		wA = $1(),
		P5 = j(),
		p8 = HD();
	function jA(D, F, { key: _, value: B }) {
		if (P5.isNode(_) && _.addToJSMap) _.addToJSMap(D, F, B);
		else if (R5.isMergeKey(D, _)) R5.addMergeToJSMap(D, F, B);
		else {
			let $ = p8.toJS(_, "", D);
			if (F instanceof Map) F.set($, p8.toJS(B, $, D));
			else if (F instanceof Set) F.add($);
			else {
				let Z = uA(_, $, D),
					q = p8.toJS(B, Z, D);
				if (Z in F)
					Object.defineProperty(F, Z, {
						value: q,
						writable: !0,
						enumerable: !0,
						configurable: !0,
					});
				else F[Z] = q;
			}
		}
		return F;
	}
	function uA(D, F, _) {
		if (F === null) return "";
		if (typeof F !== "object") return String(F);
		if (P5.isNode(D) && _?.doc) {
			let B = wA.createStringifyContext(_.doc, {});
			B.anchors = new Set();
			for (let Z of _.anchors.keys()) B.anchors.add(Z.anchor);
			(B.inFlow = !0), (B.inStringifyKey = !0);
			let $ = D.toString(B);
			if (!_.mapKeyWarned) {
				let Z = JSON.stringify($);
				if (Z.length > 40) Z = Z.substring(0, 36) + '..."';
				OA.warn(
					_.doc.options.logLevel,
					`Keys with collection values will be stringified due to JS Object restrictions: ${Z}. Set mapAsMap: true to use object keys.`,
				),
					(_.mapKeyWarned = !0);
			}
			return $;
		}
		return JSON.stringify(F);
	}
	NA.addPairToJSMap = jA;
});
var ID = W((gA) => {
	var T5 = D1(),
		EA = Y5(),
		xA = a8(),
		MF = j();
	function bA(D, F, _) {
		let B = T5.createNode(D, void 0, _),
			$ = T5.createNode(F, void 0, _);
		return new RF(B, $);
	}
	class RF {
		constructor(D, F = null) {
			Object.defineProperty(this, MF.NODE_TYPE, { value: MF.PAIR }),
				(this.key = D),
				(this.value = F);
		}
		clone(D) {
			let { key: F, value: _ } = this;
			if (MF.isNode(F)) F = F.clone(D);
			if (MF.isNode(_)) _ = _.clone(D);
			return new RF(F, _);
		}
		toJSON(D, F) {
			let _ = F?.mapAsMap ? new Map() : {};
			return xA.addPairToJSMap(F, _, this);
		}
		toString(D, F, _) {
			return D?.doc ? EA.stringifyPair(this, D, F, _) : JSON.stringify(this);
		}
	}
	gA.Pair = RF;
	gA.createPair = bA;
});
var i8 = W((hA) => {
	var cD = j(),
		O5 = $1(),
		PF = F1();
	function kA(D, F, _) {
		return ((F.inFlow ?? D.flow) ? mA : fA)(D, F, _);
	}
	function fA(
		{ comment: D, items: F },
		_,
		{
			blockItemPrefix: B,
			flowChars: $,
			itemIndent: Z,
			onChompKeep: q,
			onComment: X,
		},
	) {
		let {
				indent: Q,
				options: { commentString: J },
			} = _,
			z = Object.assign({}, _, { indent: Z, type: null }),
			A = !1,
			L = [];
		for (let H = 0; H < F.length; ++H) {
			let V = F[H],
				C = null;
			if (cD.isNode(V)) {
				if (!A && V.spaceBefore) L.push("");
				if ((TF(_, L, V.commentBefore, A), V.comment)) C = V.comment;
			} else if (cD.isPair(V)) {
				let I = cD.isNode(V.key) ? V.key : null;
				if (I) {
					if (!A && I.spaceBefore) L.push("");
					TF(_, L, I.commentBefore, A);
				}
			}
			A = !1;
			let K = O5.stringify(
				V,
				z,
				() => (C = null),
				() => (A = !0),
			);
			if (C) K += PF.lineComment(K, Z, J(C));
			if (A && C) A = !1;
			L.push(B + K);
		}
		let G;
		if (L.length === 0) G = $.start + $.end;
		else {
			G = L[0];
			for (let H = 1; H < L.length; ++H) {
				let V = L[H];
				G += V
					? `
${Q}${V}`
					: `
`;
			}
		}
		if (D) {
			if (
				((G +=
					`
` + PF.indentComment(J(D), Q)),
				X)
			)
				X();
		} else if (A && q) q();
		return G;
	}
	function mA({ items: D }, F, { flowChars: _, itemIndent: B }) {
		let {
			indent: $,
			indentStep: Z,
			flowCollectionPadding: q,
			options: { commentString: X },
		} = F;
		B += Z;
		let Q = Object.assign({}, F, { indent: B, inFlow: !0, type: null }),
			J = !1,
			z = 0,
			A = [];
		for (let H = 0; H < D.length; ++H) {
			let V = D[H],
				C = null;
			if (cD.isNode(V)) {
				if (V.spaceBefore) A.push("");
				if ((TF(F, A, V.commentBefore, !1), V.comment)) C = V.comment;
			} else if (cD.isPair(V)) {
				let I = cD.isNode(V.key) ? V.key : null;
				if (I) {
					if (I.spaceBefore) A.push("");
					if ((TF(F, A, I.commentBefore, !1), I.comment)) J = !0;
				}
				let M = cD.isNode(V.value) ? V.value : null;
				if (M) {
					if (M.comment) C = M.comment;
					if (M.commentBefore) J = !0;
				} else if (V.value == null && I?.comment) C = I.comment;
			}
			if (C) J = !0;
			let K = O5.stringify(V, Q, () => (C = null));
			if (H < D.length - 1) K += ",";
			if (C) K += PF.lineComment(K, B, X(C));
			if (
				!J &&
				(A.length > z ||
					K.includes(`
`))
			)
				J = !0;
			A.push(K), (z = A.length);
		}
		let { start: L, end: G } = _;
		if (A.length === 0) return L + G;
		else {
			if (!J) {
				let H = A.reduce((V, C) => V + C.length + 2, 2);
				J = F.options.lineWidth > 0 && H > F.options.lineWidth;
			}
			if (J) {
				let H = L;
				for (let V of A)
					H += V
						? `
${Z}${$}${V}`
						: `
`;
				return `${H}
${$}${G}`;
			} else return `${L}${q}${A.join(" ")}${q}${G}`;
		}
	}
	function TF({ indent: D, options: { commentString: F } }, _, B, $) {
		if (B && $) B = B.replace(/^\n+/, "");
		if (B) {
			let Z = PF.indentComment(F(B), D);
			_.push(Z.trimStart());
		}
	}
	hA.stringifyCollection = kA;
});
var MD = W((iA) => {
	var dA = i8(),
		cA = a8(),
		pA = CF(),
		UD = j(),
		OF = ID(),
		aA = p();
	function X1(D, F) {
		let _ = UD.isScalar(F) ? F.value : F;
		for (let B of D)
			if (UD.isPair(B)) {
				if (B.key === F || B.key === _) return B;
				if (UD.isScalar(B.key) && B.key.value === _) return B;
			}
		return;
	}
	class w5 extends pA.Collection {
		static get tagName() {
			return "tag:yaml.org,2002:map";
		}
		constructor(D) {
			super(UD.MAP, D);
			this.items = [];
		}
		static from(D, F, _) {
			let { keepUndefined: B, replacer: $ } = _,
				Z = new this(D),
				q = (X, Q) => {
					if (typeof $ === "function") Q = $.call(F, X, Q);
					else if (Array.isArray($) && !$.includes(X)) return;
					if (Q !== void 0 || B) Z.items.push(OF.createPair(X, Q, _));
				};
			if (F instanceof Map) for (let [X, Q] of F) q(X, Q);
			else if (F && typeof F === "object")
				for (let X of Object.keys(F)) q(X, F[X]);
			if (typeof D.sortMapEntries === "function")
				Z.items.sort(D.sortMapEntries);
			return Z;
		}
		add(D, F) {
			let _;
			if (UD.isPair(D)) _ = D;
			else if (!D || typeof D !== "object" || !("key" in D))
				_ = new OF.Pair(D, D?.value);
			else _ = new OF.Pair(D.key, D.value);
			let B = X1(this.items, _.key),
				$ = this.schema?.sortMapEntries;
			if (B) {
				if (!F) throw new Error(`Key ${_.key} already set`);
				if (UD.isScalar(B.value) && aA.isScalarValue(_.value))
					B.value.value = _.value;
				else B.value = _.value;
			} else if ($) {
				let Z = this.items.findIndex((q) => $(_, q) < 0);
				if (Z === -1) this.items.push(_);
				else this.items.splice(Z, 0, _);
			} else this.items.push(_);
		}
		delete(D) {
			let F = X1(this.items, D);
			if (!F) return !1;
			return this.items.splice(this.items.indexOf(F), 1).length > 0;
		}
		get(D, F) {
			let B = X1(this.items, D)?.value;
			return (!F && UD.isScalar(B) ? B.value : B) ?? void 0;
		}
		has(D) {
			return !!X1(this.items, D);
		}
		set(D, F) {
			this.add(new OF.Pair(D, F), !0);
		}
		toJSON(D, F, _) {
			let B = _ ? new _() : F?.mapAsMap ? new Map() : {};
			if (F?.onCreate) F.onCreate(B);
			for (let $ of this.items) cA.addPairToJSMap(F, B, $);
			return B;
		}
		toString(D, F, _) {
			if (!D) return JSON.stringify(this);
			for (let B of this.items)
				if (!UD.isPair(B))
					throw new Error(
						`Map items must all be pairs; found ${JSON.stringify(B)} instead`,
					);
			if (!D.allNullValues && this.hasAllNullValues(!1))
				D = Object.assign({}, D, { allNullValues: !0 });
			return dA.stringifyCollection(this, D, {
				blockItemPrefix: "",
				flowChars: { start: "{", end: "}" },
				itemIndent: D.indent || "",
				onChompKeep: _,
				onComment: F,
			});
		}
	}
	iA.YAMLMap = w5;
	iA.findPair = X1;
});
var G2 = W((tA) => {
	var nA = j(),
		j5 = MD(),
		oA = {
			collection: "map",
			default: !0,
			nodeClass: j5.YAMLMap,
			tag: "tag:yaml.org,2002:map",
			resolve(D, F) {
				if (!nA.isMap(D)) F("Expected a mapping for this tag");
				return D;
			},
			createNode: (D, F, _) => j5.YAMLMap.from(D, F, _),
		};
	tA.map = oA;
});
var RD = W((qL) => {
	var DL = D1(),
		FL = i8(),
		_L = CF(),
		jF = j(),
		BL = p(),
		$L = HD();
	class u5 extends _L.Collection {
		static get tagName() {
			return "tag:yaml.org,2002:seq";
		}
		constructor(D) {
			super(jF.SEQ, D);
			this.items = [];
		}
		add(D) {
			this.items.push(D);
		}
		delete(D) {
			let F = wF(D);
			if (typeof F !== "number") return !1;
			return this.items.splice(F, 1).length > 0;
		}
		get(D, F) {
			let _ = wF(D);
			if (typeof _ !== "number") return;
			let B = this.items[_];
			return !F && jF.isScalar(B) ? B.value : B;
		}
		has(D) {
			let F = wF(D);
			return typeof F === "number" && F < this.items.length;
		}
		set(D, F) {
			let _ = wF(D);
			if (typeof _ !== "number")
				throw new Error(`Expected a valid index, not ${D}.`);
			let B = this.items[_];
			if (jF.isScalar(B) && BL.isScalarValue(F)) B.value = F;
			else this.items[_] = F;
		}
		toJSON(D, F) {
			let _ = [];
			if (F?.onCreate) F.onCreate(_);
			let B = 0;
			for (let $ of this.items) _.push($L.toJS($, String(B++), F));
			return _;
		}
		toString(D, F, _) {
			if (!D) return JSON.stringify(this);
			return FL.stringifyCollection(this, D, {
				blockItemPrefix: "- ",
				flowChars: { start: "[", end: "]" },
				itemIndent: (D.indent || "") + "  ",
				onChompKeep: _,
				onComment: F,
			});
		}
		static from(D, F, _) {
			let { replacer: B } = _,
				$ = new this(D);
			if (F && Symbol.iterator in Object(F)) {
				let Z = 0;
				for (let q of F) {
					if (typeof B === "function") {
						let X = F instanceof Set ? q : String(Z++);
						q = B.call(F, X, q);
					}
					$.items.push(DL.createNode(q, void 0, _));
				}
			}
			return $;
		}
	}
	function wF(D) {
		let F = jF.isScalar(D) ? D.value : D;
		if (F && typeof F === "string") F = Number(F);
		return typeof F === "number" && Number.isInteger(F) && F >= 0 ? F : null;
	}
	qL.YAMLSeq = u5;
});
var V2 = W((JL) => {
	var XL = j(),
		N5 = RD(),
		QL = {
			collection: "seq",
			default: !0,
			nodeClass: N5.YAMLSeq,
			tag: "tag:yaml.org,2002:seq",
			resolve(D, F) {
				if (!XL.isSeq(D)) F("Expected a sequence for this tag");
				return D;
			},
			createNode: (D, F, _) => N5.YAMLSeq.from(D, F, _),
		};
	JL.seq = QL;
});
var Q1 = W((GL) => {
	var AL = B1(),
		LL = {
			identify: (D) => typeof D === "string",
			default: !0,
			tag: "tag:yaml.org,2002:str",
			resolve: (D) => D,
			stringify(D, F, _, B) {
				return (
					(F = Object.assign({ actualString: !0 }, F)),
					AL.stringifyString(D, F, _, B)
				);
			},
		};
	GL.string = LL;
});
var uF = W((CL) => {
	var S5 = p(),
		E5 = {
			identify: (D) => D == null,
			createNode: () => new S5.Scalar(null),
			default: !0,
			tag: "tag:yaml.org,2002:null",
			test: /^(?:~|[Nn]ull|NULL)?$/,
			resolve: () => new S5.Scalar(null),
			stringify: ({ source: D }, F) =>
				typeof D === "string" && E5.test.test(D) ? D : F.options.nullStr,
		};
	CL.nullTag = E5;
});
var s8 = W((KL) => {
	var HL = p(),
		x5 = {
			identify: (D) => typeof D === "boolean",
			default: !0,
			tag: "tag:yaml.org,2002:bool",
			test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
			resolve: (D) => new HL.Scalar(D[0] === "t" || D[0] === "T"),
			stringify({ source: D, value: F }, _) {
				if (D && x5.test.test(D)) {
					let B = D[0] === "t" || D[0] === "T";
					if (F === B) return D;
				}
				return F ? _.options.trueStr : _.options.falseStr;
			},
		};
	KL.boolTag = x5;
});
var C2 = W((UL) => {
	function IL({ format: D, minFractionDigits: F, tag: _, value: B }) {
		if (typeof B === "bigint") return String(B);
		let $ = typeof B === "number" ? B : Number(B);
		if (!isFinite($)) return isNaN($) ? ".nan" : $ < 0 ? "-.inf" : ".inf";
		let Z = JSON.stringify(B);
		if (!D && F && (!_ || _ === "tag:yaml.org,2002:float") && /^\d/.test(Z)) {
			let q = Z.indexOf(".");
			if (q < 0) (q = Z.length), (Z += ".");
			let X = F - (Z.length - q - 1);
			while (X-- > 0) Z += "0";
		}
		return Z;
	}
	UL.stringifyNumber = IL;
});
var n8 = W((wL) => {
	var RL = p(),
		r8 = C2(),
		PL = {
			identify: (D) => typeof D === "number",
			default: !0,
			tag: "tag:yaml.org,2002:float",
			test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
			resolve: (D) =>
				D.slice(-3).toLowerCase() === "nan"
					? NaN
					: D[0] === "-"
						? Number.NEGATIVE_INFINITY
						: Number.POSITIVE_INFINITY,
			stringify: r8.stringifyNumber,
		},
		TL = {
			identify: (D) => typeof D === "number",
			default: !0,
			tag: "tag:yaml.org,2002:float",
			format: "EXP",
			test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
			resolve: (D) => parseFloat(D),
			stringify(D) {
				let F = Number(D.value);
				return isFinite(F) ? F.toExponential() : r8.stringifyNumber(D);
			},
		},
		OL = {
			identify: (D) => typeof D === "number",
			default: !0,
			tag: "tag:yaml.org,2002:float",
			test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
			resolve(D) {
				let F = new RL.Scalar(parseFloat(D)),
					_ = D.indexOf(".");
				if (_ !== -1 && D[D.length - 1] === "0")
					F.minFractionDigits = D.length - _ - 1;
				return F;
			},
			stringify: r8.stringifyNumber,
		};
	wL.float = OL;
	wL.floatExp = TL;
	wL.floatNaN = PL;
});
var t8 = W((bL) => {
	var b5 = C2(),
		NF = (D) => typeof D === "bigint" || Number.isInteger(D),
		o8 = (D, F, _, { intAsBigInt: B }) =>
			B ? BigInt(D) : parseInt(D.substring(F), _);
	function g5(D, F, _) {
		let { value: B } = D;
		if (NF(B) && B >= 0) return _ + B.toString(F);
		return b5.stringifyNumber(D);
	}
	var SL = {
			identify: (D) => NF(D) && D >= 0,
			default: !0,
			tag: "tag:yaml.org,2002:int",
			format: "OCT",
			test: /^0o[0-7]+$/,
			resolve: (D, F, _) => o8(D, 2, 8, _),
			stringify: (D) => g5(D, 8, "0o"),
		},
		EL = {
			identify: NF,
			default: !0,
			tag: "tag:yaml.org,2002:int",
			test: /^[-+]?[0-9]+$/,
			resolve: (D, F, _) => o8(D, 0, 10, _),
			stringify: b5.stringifyNumber,
		},
		xL = {
			identify: (D) => NF(D) && D >= 0,
			default: !0,
			tag: "tag:yaml.org,2002:int",
			format: "HEX",
			test: /^0x[0-9a-fA-F]+$/,
			resolve: (D, F, _) => o8(D, 2, 16, _),
			stringify: (D) => g5(D, 16, "0x"),
		};
	bL.int = EL;
	bL.intHex = xL;
	bL.intOct = SL;
});
var v5 = W((cL) => {
	var kL = G2(),
		fL = uF(),
		mL = V2(),
		hL = Q1(),
		lL = s8(),
		e8 = n8(),
		D6 = t8(),
		dL = [
			kL.map,
			mL.seq,
			hL.string,
			fL.nullTag,
			lL.boolTag,
			D6.intOct,
			D6.int,
			D6.intHex,
			e8.floatNaN,
			e8.floatExp,
			e8.float,
		];
	cL.schema = dL;
});
var k5 = W((tL) => {
	var aL = p(),
		iL = G2(),
		sL = V2();
	function y5(D) {
		return typeof D === "bigint" || Number.isInteger(D);
	}
	var SF = ({ value: D }) => JSON.stringify(D),
		rL = [
			{
				identify: (D) => typeof D === "string",
				default: !0,
				tag: "tag:yaml.org,2002:str",
				resolve: (D) => D,
				stringify: SF,
			},
			{
				identify: (D) => D == null,
				createNode: () => new aL.Scalar(null),
				default: !0,
				tag: "tag:yaml.org,2002:null",
				test: /^null$/,
				resolve: () => null,
				stringify: SF,
			},
			{
				identify: (D) => typeof D === "boolean",
				default: !0,
				tag: "tag:yaml.org,2002:bool",
				test: /^true$|^false$/,
				resolve: (D) => D === "true",
				stringify: SF,
			},
			{
				identify: y5,
				default: !0,
				tag: "tag:yaml.org,2002:int",
				test: /^-?(?:0|[1-9][0-9]*)$/,
				resolve: (D, F, { intAsBigInt: _ }) =>
					_ ? BigInt(D) : parseInt(D, 10),
				stringify: ({ value: D }) => (y5(D) ? D.toString() : JSON.stringify(D)),
			},
			{
				identify: (D) => typeof D === "number",
				default: !0,
				tag: "tag:yaml.org,2002:float",
				test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
				resolve: (D) => parseFloat(D),
				stringify: SF,
			},
		],
		nL = {
			default: !0,
			tag: "",
			test: /^/,
			resolve(D, F) {
				return F(`Unresolved plain scalar ${JSON.stringify(D)}`), D;
			},
		},
		oL = [iL.map, sL.seq].concat(rL, nL);
	tL.schema = oL;
});
var _6 = W((_G) => {
	var J1 = R("buffer"),
		F6 = p(),
		DG = B1(),
		FG = {
			identify: (D) => D instanceof Uint8Array,
			default: !1,
			tag: "tag:yaml.org,2002:binary",
			resolve(D, F) {
				if (typeof J1.Buffer === "function") return J1.Buffer.from(D, "base64");
				else if (typeof atob === "function") {
					let _ = atob(D.replace(/[\n\r]/g, "")),
						B = new Uint8Array(_.length);
					for (let $ = 0; $ < _.length; ++$) B[$] = _.charCodeAt($);
					return B;
				} else
					return (
						F(
							"This environment does not support reading binary tags; either Buffer or atob is required",
						),
						D
					);
			},
			stringify({ comment: D, type: F, value: _ }, B, $, Z) {
				let q = _,
					X;
				if (typeof J1.Buffer === "function")
					X =
						q instanceof J1.Buffer
							? q.toString("base64")
							: J1.Buffer.from(q.buffer).toString("base64");
				else if (typeof btoa === "function") {
					let Q = "";
					for (let J = 0; J < q.length; ++J) Q += String.fromCharCode(q[J]);
					X = btoa(Q);
				} else
					throw new Error(
						"This environment does not support writing binary tags; either Buffer or btoa is required",
					);
				if (!F) F = F6.Scalar.BLOCK_LITERAL;
				if (F !== F6.Scalar.QUOTE_DOUBLE) {
					let Q = Math.max(
							B.options.lineWidth - B.indent.length,
							B.options.minContentWidth,
						),
						J = Math.ceil(X.length / Q),
						z = new Array(J);
					for (let A = 0, L = 0; A < J; ++A, L += Q) z[A] = X.substr(L, Q);
					X = z.join(
						F === F6.Scalar.BLOCK_LITERAL
							? `
`
							: " ",
					);
				}
				return DG.stringifyString({ comment: D, type: F, value: X }, B, $, Z);
			},
		};
	_G.binary = FG;
});
var xF = W((XG) => {
	var EF = j(),
		B6 = ID(),
		$G = p(),
		qG = RD();
	function f5(D, F) {
		if (EF.isSeq(D))
			for (let _ = 0; _ < D.items.length; ++_) {
				let B = D.items[_];
				if (EF.isPair(B)) continue;
				else if (EF.isMap(B)) {
					if (B.items.length > 1)
						F("Each pair must have its own sequence indicator");
					let $ = B.items[0] || new B6.Pair(new $G.Scalar(null));
					if (B.commentBefore)
						$.key.commentBefore = $.key.commentBefore
							? `${B.commentBefore}
${$.key.commentBefore}`
							: B.commentBefore;
					if (B.comment) {
						let Z = $.value ?? $.key;
						Z.comment = Z.comment
							? `${B.comment}
${Z.comment}`
							: B.comment;
					}
					B = $;
				}
				D.items[_] = EF.isPair(B) ? B : new B6.Pair(B);
			}
		else F("Expected a sequence for this tag");
		return D;
	}
	function m5(D, F, _) {
		let { replacer: B } = _,
			$ = new qG.YAMLSeq(D);
		$.tag = "tag:yaml.org,2002:pairs";
		let Z = 0;
		if (F && Symbol.iterator in Object(F))
			for (let q of F) {
				if (typeof B === "function") q = B.call(F, String(Z++), q);
				let X, Q;
				if (Array.isArray(q))
					if (q.length === 2) (X = q[0]), (Q = q[1]);
					else throw new TypeError(`Expected [key, value] tuple: ${q}`);
				else if (q && q instanceof Object) {
					let J = Object.keys(q);
					if (J.length === 1) (X = J[0]), (Q = q[X]);
					else
						throw new TypeError(
							`Expected tuple with one key, not ${J.length} keys`,
						);
				} else X = q;
				$.items.push(B6.createPair(X, Q, _));
			}
		return $;
	}
	var ZG = {
		collection: "seq",
		default: !1,
		tag: "tag:yaml.org,2002:pairs",
		resolve: f5,
		createNode: m5,
	};
	XG.createPairs = m5;
	XG.pairs = ZG;
	XG.resolvePairs = f5;
});
var q6 = W((GG) => {
	var h5 = j(),
		$6 = HD(),
		z1 = MD(),
		AG = RD(),
		l5 = xF();
	class pD extends AG.YAMLSeq {
		constructor() {
			super();
			(this.add = z1.YAMLMap.prototype.add.bind(this)),
				(this.delete = z1.YAMLMap.prototype.delete.bind(this)),
				(this.get = z1.YAMLMap.prototype.get.bind(this)),
				(this.has = z1.YAMLMap.prototype.has.bind(this)),
				(this.set = z1.YAMLMap.prototype.set.bind(this)),
				(this.tag = pD.tag);
		}
		toJSON(D, F) {
			if (!F) return super.toJSON(D);
			let _ = new Map();
			if (F?.onCreate) F.onCreate(_);
			for (let B of this.items) {
				let $, Z;
				if (h5.isPair(B))
					($ = $6.toJS(B.key, "", F)), (Z = $6.toJS(B.value, $, F));
				else $ = $6.toJS(B, "", F);
				if (_.has($))
					throw new Error("Ordered maps must not include duplicate keys");
				_.set($, Z);
			}
			return _;
		}
		static from(D, F, _) {
			let B = l5.createPairs(D, F, _),
				$ = new this();
			return ($.items = B.items), $;
		}
	}
	pD.tag = "tag:yaml.org,2002:omap";
	var LG = {
		collection: "seq",
		identify: (D) => D instanceof Map,
		nodeClass: pD,
		default: !1,
		tag: "tag:yaml.org,2002:omap",
		resolve(D, F) {
			let _ = l5.resolvePairs(D, F),
				B = [];
			for (let { key: $ } of _.items)
				if (h5.isScalar($))
					if (B.includes($.value))
						F(`Ordered maps must not include duplicate keys: ${$.value}`);
					else B.push($.value);
			return Object.assign(new pD(), _);
		},
		createNode: (D, F, _) => pD.from(D, F, _),
	};
	GG.YAMLOMap = pD;
	GG.omap = LG;
});
var i5 = W((WG) => {
	var d5 = p();
	function c5({ value: D, source: F }, _) {
		if (F && (D ? p5 : a5).test.test(F)) return F;
		return D ? _.options.trueStr : _.options.falseStr;
	}
	var p5 = {
			identify: (D) => D === !0,
			default: !0,
			tag: "tag:yaml.org,2002:bool",
			test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
			resolve: () => new d5.Scalar(!0),
			stringify: c5,
		},
		a5 = {
			identify: (D) => D === !1,
			default: !0,
			tag: "tag:yaml.org,2002:bool",
			test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
			resolve: () => new d5.Scalar(!1),
			stringify: c5,
		};
	WG.falseTag = a5;
	WG.trueTag = p5;
});
var s5 = W((RG) => {
	var YG = p(),
		Z6 = C2(),
		IG = {
			identify: (D) => typeof D === "number",
			default: !0,
			tag: "tag:yaml.org,2002:float",
			test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
			resolve: (D) =>
				D.slice(-3).toLowerCase() === "nan"
					? NaN
					: D[0] === "-"
						? Number.NEGATIVE_INFINITY
						: Number.POSITIVE_INFINITY,
			stringify: Z6.stringifyNumber,
		},
		UG = {
			identify: (D) => typeof D === "number",
			default: !0,
			tag: "tag:yaml.org,2002:float",
			format: "EXP",
			test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
			resolve: (D) => parseFloat(D.replace(/_/g, "")),
			stringify(D) {
				let F = Number(D.value);
				return isFinite(F) ? F.toExponential() : Z6.stringifyNumber(D);
			},
		},
		MG = {
			identify: (D) => typeof D === "number",
			default: !0,
			tag: "tag:yaml.org,2002:float",
			test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
			resolve(D) {
				let F = new YG.Scalar(parseFloat(D.replace(/_/g, ""))),
					_ = D.indexOf(".");
				if (_ !== -1) {
					let B = D.substring(_ + 1).replace(/_/g, "");
					if (B[B.length - 1] === "0") F.minFractionDigits = B.length;
				}
				return F;
			},
			stringify: Z6.stringifyNumber,
		};
	RG.float = MG;
	RG.floatExp = UG;
	RG.floatNaN = IG;
});
var n5 = W((SG) => {
	var r5 = C2(),
		A1 = (D) => typeof D === "bigint" || Number.isInteger(D);
	function bF(D, F, _, { intAsBigInt: B }) {
		let $ = D[0];
		if ($ === "-" || $ === "+") F += 1;
		if (((D = D.substring(F).replace(/_/g, "")), B)) {
			switch (_) {
				case 2:
					D = `0b${D}`;
					break;
				case 8:
					D = `0o${D}`;
					break;
				case 16:
					D = `0x${D}`;
					break;
			}
			let q = BigInt(D);
			return $ === "-" ? BigInt(-1) * q : q;
		}
		let Z = parseInt(D, _);
		return $ === "-" ? -1 * Z : Z;
	}
	function X6(D, F, _) {
		let { value: B } = D;
		if (A1(B)) {
			let $ = B.toString(F);
			return B < 0 ? "-" + _ + $.substr(1) : _ + $;
		}
		return r5.stringifyNumber(D);
	}
	var wG = {
			identify: A1,
			default: !0,
			tag: "tag:yaml.org,2002:int",
			format: "BIN",
			test: /^[-+]?0b[0-1_]+$/,
			resolve: (D, F, _) => bF(D, 2, 2, _),
			stringify: (D) => X6(D, 2, "0b"),
		},
		jG = {
			identify: A1,
			default: !0,
			tag: "tag:yaml.org,2002:int",
			format: "OCT",
			test: /^[-+]?0[0-7_]+$/,
			resolve: (D, F, _) => bF(D, 1, 8, _),
			stringify: (D) => X6(D, 8, "0"),
		},
		uG = {
			identify: A1,
			default: !0,
			tag: "tag:yaml.org,2002:int",
			test: /^[-+]?[0-9][0-9_]*$/,
			resolve: (D, F, _) => bF(D, 0, 10, _),
			stringify: r5.stringifyNumber,
		},
		NG = {
			identify: A1,
			default: !0,
			tag: "tag:yaml.org,2002:int",
			format: "HEX",
			test: /^[-+]?0x[0-9a-fA-F_]+$/,
			resolve: (D, F, _) => bF(D, 2, 16, _),
			stringify: (D) => X6(D, 16, "0x"),
		};
	SG.int = uG;
	SG.intBin = wG;
	SG.intHex = NG;
	SG.intOct = jG;
});
var Q6 = W((yG) => {
	var yF = j(),
		gF = ID(),
		vF = MD();
	class aD extends vF.YAMLMap {
		constructor(D) {
			super(D);
			this.tag = aD.tag;
		}
		add(D) {
			let F;
			if (yF.isPair(D)) F = D;
			else if (
				D &&
				typeof D === "object" &&
				"key" in D &&
				"value" in D &&
				D.value === null
			)
				F = new gF.Pair(D.key, null);
			else F = new gF.Pair(D, null);
			if (!vF.findPair(this.items, F.key)) this.items.push(F);
		}
		get(D, F) {
			let _ = vF.findPair(this.items, D);
			return !F && yF.isPair(_)
				? yF.isScalar(_.key)
					? _.key.value
					: _.key
				: _;
		}
		set(D, F) {
			if (typeof F !== "boolean")
				throw new Error(
					`Expected boolean value for set(key, value) in a YAML set, not ${typeof F}`,
				);
			let _ = vF.findPair(this.items, D);
			if (_ && !F) this.items.splice(this.items.indexOf(_), 1);
			else if (!_ && F) this.items.push(new gF.Pair(D));
		}
		toJSON(D, F) {
			return super.toJSON(D, F, Set);
		}
		toString(D, F, _) {
			if (!D) return JSON.stringify(this);
			if (this.hasAllNullValues(!0))
				return super.toString(
					Object.assign({}, D, { allNullValues: !0 }),
					F,
					_,
				);
			else throw new Error("Set items must all have null values");
		}
		static from(D, F, _) {
			let { replacer: B } = _,
				$ = new this(D);
			if (F && Symbol.iterator in Object(F))
				for (let Z of F) {
					if (typeof B === "function") Z = B.call(F, Z, Z);
					$.items.push(gF.createPair(Z, null, _));
				}
			return $;
		}
	}
	aD.tag = "tag:yaml.org,2002:set";
	var vG = {
		collection: "map",
		identify: (D) => D instanceof Set,
		nodeClass: aD,
		default: !1,
		tag: "tag:yaml.org,2002:set",
		createNode: (D, F, _) => aD.from(D, F, _),
		resolve(D, F) {
			if (yF.isMap(D))
				if (D.hasAllNullValues(!0)) return Object.assign(new aD(), D);
				else F("Set items must all have null values");
			else F("Expected a mapping for this tag");
			return D;
		},
	};
	yG.YAMLSet = aD;
	yG.set = vG;
});
var z6 = W((dG) => {
	var mG = C2();
	function J6(D, F) {
		let _ = D[0],
			B = _ === "-" || _ === "+" ? D.substring(1) : D,
			$ = (q) => (F ? BigInt(q) : Number(q)),
			Z = B.replace(/_/g, "")
				.split(":")
				.reduce((q, X) => q * $(60) + $(X), $(0));
		return _ === "-" ? $(-1) * Z : Z;
	}
	function o5(D) {
		let { value: F } = D,
			_ = (q) => q;
		if (typeof F === "bigint") _ = (q) => BigInt(q);
		else if (isNaN(F) || !isFinite(F)) return mG.stringifyNumber(D);
		let B = "";
		if (F < 0) (B = "-"), (F *= _(-1));
		let $ = _(60),
			Z = [F % $];
		if (F < 60) Z.unshift(0);
		else if (((F = (F - Z[0]) / $), Z.unshift(F % $), F >= 60))
			(F = (F - Z[0]) / $), Z.unshift(F);
		return (
			B +
			Z.map((q) => String(q).padStart(2, "0"))
				.join(":")
				.replace(/000000\d*$/, "")
		);
	}
	var hG = {
			identify: (D) => typeof D === "bigint" || Number.isInteger(D),
			default: !0,
			tag: "tag:yaml.org,2002:int",
			format: "TIME",
			test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
			resolve: (D, F, { intAsBigInt: _ }) => J6(D, _),
			stringify: o5,
		},
		lG = {
			identify: (D) => typeof D === "number",
			default: !0,
			tag: "tag:yaml.org,2002:float",
			format: "TIME",
			test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
			resolve: (D) => J6(D, !1),
			stringify: o5,
		},
		t5 = {
			identify: (D) => D instanceof Date,
			default: !0,
			tag: "tag:yaml.org,2002:timestamp",
			test: RegExp(
				"^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$",
			),
			resolve(D) {
				let F = D.match(t5.test);
				if (!F)
					throw new Error(
						"!!timestamp expects a date, starting with yyyy-mm-dd",
					);
				let [, _, B, $, Z, q, X] = F.map(Number),
					Q = F[7] ? Number((F[7] + "00").substr(1, 3)) : 0,
					J = Date.UTC(_, B - 1, $, Z || 0, q || 0, X || 0, Q),
					z = F[8];
				if (z && z !== "Z") {
					let A = J6(z, !1);
					if (Math.abs(A) < 30) A *= 60;
					J -= 60000 * A;
				}
				return new Date(J);
			},
			stringify: ({ value: D }) =>
				D.toISOString().replace(/(T00:00:00)?\.000Z$/, ""),
		};
	dG.floatTime = lG;
	dG.intTime = hG;
	dG.timestamp = t5;
});
var D_ = W((BV) => {
	var iG = G2(),
		sG = uF(),
		rG = V2(),
		nG = Q1(),
		oG = _6(),
		e5 = i5(),
		A6 = s5(),
		kF = n5(),
		tG = UF(),
		eG = q6(),
		DV = xF(),
		FV = Q6(),
		L6 = z6(),
		_V = [
			iG.map,
			rG.seq,
			nG.string,
			sG.nullTag,
			e5.trueTag,
			e5.falseTag,
			kF.intBin,
			kF.intOct,
			kF.int,
			kF.intHex,
			A6.floatNaN,
			A6.floatExp,
			A6.float,
			oG.binary,
			tG.merge,
			eG.omap,
			DV.pairs,
			FV.set,
			L6.intTime,
			L6.floatTime,
			L6.timestamp,
		];
	BV.schema = _V;
});
var z_ = W((LV) => {
	var $_ = G2(),
		qV = uF(),
		q_ = V2(),
		ZV = Q1(),
		XV = s8(),
		G6 = n8(),
		V6 = t8(),
		QV = v5(),
		JV = k5(),
		Z_ = _6(),
		L1 = UF(),
		X_ = q6(),
		Q_ = xF(),
		F_ = D_(),
		J_ = Q6(),
		fF = z6(),
		__ = new Map([
			["core", QV.schema],
			["failsafe", [$_.map, q_.seq, ZV.string]],
			["json", JV.schema],
			["yaml11", F_.schema],
			["yaml-1.1", F_.schema],
		]),
		B_ = {
			binary: Z_.binary,
			bool: XV.boolTag,
			float: G6.float,
			floatExp: G6.floatExp,
			floatNaN: G6.floatNaN,
			floatTime: fF.floatTime,
			int: V6.int,
			intHex: V6.intHex,
			intOct: V6.intOct,
			intTime: fF.intTime,
			map: $_.map,
			merge: L1.merge,
			null: qV.nullTag,
			omap: X_.omap,
			pairs: Q_.pairs,
			seq: q_.seq,
			set: J_.set,
			timestamp: fF.timestamp,
		},
		zV = {
			"tag:yaml.org,2002:binary": Z_.binary,
			"tag:yaml.org,2002:merge": L1.merge,
			"tag:yaml.org,2002:omap": X_.omap,
			"tag:yaml.org,2002:pairs": Q_.pairs,
			"tag:yaml.org,2002:set": J_.set,
			"tag:yaml.org,2002:timestamp": fF.timestamp,
		};
	function AV(D, F, _) {
		let B = __.get(F);
		if (B && !D)
			return _ && !B.includes(L1.merge) ? B.concat(L1.merge) : B.slice();
		let $ = B;
		if (!$)
			if (Array.isArray(D)) $ = [];
			else {
				let Z = Array.from(__.keys())
					.filter((q) => q !== "yaml11")
					.map((q) => JSON.stringify(q))
					.join(", ");
				throw new Error(
					`Unknown schema "${F}"; use one of ${Z} or define customTags array`,
				);
			}
		if (Array.isArray(D)) for (let Z of D) $ = $.concat(Z);
		else if (typeof D === "function") $ = D($.slice());
		if (_) $ = $.concat(L1.merge);
		return $.reduce((Z, q) => {
			let X = typeof q === "string" ? B_[q] : q;
			if (!X) {
				let Q = JSON.stringify(q),
					J = Object.keys(B_)
						.map((z) => JSON.stringify(z))
						.join(", ");
				throw new Error(`Unknown custom tag ${Q}; use one of ${J}`);
			}
			if (!Z.includes(X)) Z.push(X);
			return Z;
		}, []);
	}
	LV.coreKnownTags = zV;
	LV.getTags = AV;
});
var H6 = W((YV) => {
	var C6 = j(),
		CV = G2(),
		WV = V2(),
		HV = Q1(),
		mF = z_(),
		KV = (D, F) => (D.key < F.key ? -1 : D.key > F.key ? 1 : 0);
	class W6 {
		constructor({
			compat: D,
			customTags: F,
			merge: _,
			resolveKnownTags: B,
			schema: $,
			sortMapEntries: Z,
			toStringDefaults: q,
		}) {
			(this.compat = Array.isArray(D)
				? mF.getTags(D, "compat")
				: D
					? mF.getTags(null, D)
					: null),
				(this.name = (typeof $ === "string" && $) || "core"),
				(this.knownTags = B ? mF.coreKnownTags : {}),
				(this.tags = mF.getTags(F, this.name, _)),
				(this.toStringOptions = q ?? null),
				Object.defineProperty(this, C6.MAP, { value: CV.map }),
				Object.defineProperty(this, C6.SCALAR, { value: HV.string }),
				Object.defineProperty(this, C6.SEQ, { value: WV.seq }),
				(this.sortMapEntries =
					typeof Z === "function" ? Z : Z === !0 ? KV : null);
		}
		clone() {
			let D = Object.create(
				W6.prototype,
				Object.getOwnPropertyDescriptors(this),
			);
			return (D.tags = this.tags.slice()), D;
		}
	}
	YV.Schema = W6;
});
var A_ = W((RV) => {
	var UV = j(),
		K6 = $1(),
		G1 = F1();
	function MV(D, F) {
		let _ = [],
			B = F.directives === !0;
		if (F.directives !== !1 && D.directives) {
			let Q = D.directives.toString(D);
			if (Q) _.push(Q), (B = !0);
			else if (D.directives.docStart) B = !0;
		}
		if (B) _.push("---");
		let $ = K6.createStringifyContext(D, F),
			{ commentString: Z } = $.options;
		if (D.commentBefore) {
			if (_.length !== 1) _.unshift("");
			let Q = Z(D.commentBefore);
			_.unshift(G1.indentComment(Q, ""));
		}
		let q = !1,
			X = null;
		if (D.contents) {
			if (UV.isNode(D.contents)) {
				if (D.contents.spaceBefore && B) _.push("");
				if (D.contents.commentBefore) {
					let z = Z(D.contents.commentBefore);
					_.push(G1.indentComment(z, ""));
				}
				($.forceBlockIndent = !!D.comment), (X = D.contents.comment);
			}
			let Q = X ? void 0 : () => (q = !0),
				J = K6.stringify(D.contents, $, () => (X = null), Q);
			if (X) J += G1.lineComment(J, "", Z(X));
			if ((J[0] === "|" || J[0] === ">") && _[_.length - 1] === "---")
				_[_.length - 1] = `--- ${J}`;
			else _.push(J);
		} else _.push(K6.stringify(D.contents, $));
		if (D.directives?.docEnd)
			if (D.comment) {
				let Q = Z(D.comment);
				if (
					Q.includes(`
`)
				)
					_.push("..."), _.push(G1.indentComment(Q, ""));
				else _.push(`... ${Q}`);
			} else _.push("...");
		else {
			let Q = D.comment;
			if (Q && q) Q = Q.replace(/^\n+/, "");
			if (Q) {
				if ((!q || X) && _[_.length - 1] !== "") _.push("");
				_.push(G1.indentComment(Z(Q), ""));
			}
		}
		return (
			_.join(`
`) +
			`
`
		);
	}
	RV.stringifyDocument = MV;
});
var V1 = W((EV) => {
	var TV = e2(),
		W2 = CF(),
		K0 = j(),
		OV = ID(),
		wV = HD(),
		jV = H6(),
		uV = A_(),
		Y6 = AF(),
		NV = k8(),
		SV = D1(),
		I6 = y8();
	class U6 {
		constructor(D, F, _) {
			(this.commentBefore = null),
				(this.comment = null),
				(this.errors = []),
				(this.warnings = []),
				Object.defineProperty(this, K0.NODE_TYPE, { value: K0.DOC });
			let B = null;
			if (typeof F === "function" || Array.isArray(F)) B = F;
			else if (_ === void 0 && F) (_ = F), (F = void 0);
			let $ = Object.assign(
				{
					intAsBigInt: !1,
					keepSourceTokens: !1,
					logLevel: "warn",
					prettyErrors: !0,
					strict: !0,
					stringKeys: !1,
					uniqueKeys: !0,
					version: "1.2",
				},
				_,
			);
			this.options = $;
			let { version: Z } = $;
			if (_?._directives) {
				if (
					((this.directives = _._directives.atDocument()),
					this.directives.yaml.explicit)
				)
					Z = this.directives.yaml.version;
			} else this.directives = new I6.Directives({ version: Z });
			this.setSchema(Z, _),
				(this.contents = D === void 0 ? null : this.createNode(D, B, _));
		}
		clone() {
			let D = Object.create(U6.prototype, {
				[K0.NODE_TYPE]: { value: K0.DOC },
			});
			if (
				((D.commentBefore = this.commentBefore),
				(D.comment = this.comment),
				(D.errors = this.errors.slice()),
				(D.warnings = this.warnings.slice()),
				(D.options = Object.assign({}, this.options)),
				this.directives)
			)
				D.directives = this.directives.clone();
			if (
				((D.schema = this.schema.clone()),
				(D.contents = K0.isNode(this.contents)
					? this.contents.clone(D.schema)
					: this.contents),
				this.range)
			)
				D.range = this.range.slice();
			return D;
		}
		add(D) {
			if (H2(this.contents)) this.contents.add(D);
		}
		addIn(D, F) {
			if (H2(this.contents)) this.contents.addIn(D, F);
		}
		createAlias(D, F) {
			if (!D.anchor) {
				let _ = Y6.anchorNames(this);
				D.anchor = !F || _.has(F) ? Y6.findNewAnchor(F || "a", _) : F;
			}
			return new TV.Alias(D.anchor);
		}
		createNode(D, F, _) {
			let B = void 0;
			if (typeof F === "function") (D = F.call({ "": D }, "", D)), (B = F);
			else if (Array.isArray(F)) {
				let V = (K) =>
						typeof K === "number" || K instanceof String || K instanceof Number,
					C = F.filter(V).map(String);
				if (C.length > 0) F = F.concat(C);
				B = F;
			} else if (_ === void 0 && F) (_ = F), (F = void 0);
			let {
					aliasDuplicateObjects: $,
					anchorPrefix: Z,
					flow: q,
					keepUndefined: X,
					onTagObj: Q,
					tag: J,
				} = _ ?? {},
				{
					onAnchor: z,
					setAnchors: A,
					sourceObjects: L,
				} = Y6.createNodeAnchors(this, Z || "a"),
				G = {
					aliasDuplicateObjects: $ ?? !0,
					keepUndefined: X ?? !1,
					onAnchor: z,
					onTagObj: Q,
					replacer: B,
					schema: this.schema,
					sourceObjects: L,
				},
				H = SV.createNode(D, J, G);
			if (q && K0.isCollection(H)) H.flow = !0;
			return A(), H;
		}
		createPair(D, F, _ = {}) {
			let B = this.createNode(D, null, _),
				$ = this.createNode(F, null, _);
			return new OV.Pair(B, $);
		}
		delete(D) {
			return H2(this.contents) ? this.contents.delete(D) : !1;
		}
		deleteIn(D) {
			if (W2.isEmptyPath(D)) {
				if (this.contents == null) return !1;
				return (this.contents = null), !0;
			}
			return H2(this.contents) ? this.contents.deleteIn(D) : !1;
		}
		get(D, F) {
			return K0.isCollection(this.contents) ? this.contents.get(D, F) : void 0;
		}
		getIn(D, F) {
			if (W2.isEmptyPath(D))
				return !F && K0.isScalar(this.contents)
					? this.contents.value
					: this.contents;
			return K0.isCollection(this.contents)
				? this.contents.getIn(D, F)
				: void 0;
		}
		has(D) {
			return K0.isCollection(this.contents) ? this.contents.has(D) : !1;
		}
		hasIn(D) {
			if (W2.isEmptyPath(D)) return this.contents !== void 0;
			return K0.isCollection(this.contents) ? this.contents.hasIn(D) : !1;
		}
		set(D, F) {
			if (this.contents == null)
				this.contents = W2.collectionFromPath(this.schema, [D], F);
			else if (H2(this.contents)) this.contents.set(D, F);
		}
		setIn(D, F) {
			if (W2.isEmptyPath(D)) this.contents = F;
			else if (this.contents == null)
				this.contents = W2.collectionFromPath(this.schema, Array.from(D), F);
			else if (H2(this.contents)) this.contents.setIn(D, F);
		}
		setSchema(D, F = {}) {
			if (typeof D === "number") D = String(D);
			let _;
			switch (D) {
				case "1.1":
					if (this.directives) this.directives.yaml.version = "1.1";
					else this.directives = new I6.Directives({ version: "1.1" });
					_ = { resolveKnownTags: !1, schema: "yaml-1.1" };
					break;
				case "1.2":
				case "next":
					if (this.directives) this.directives.yaml.version = D;
					else this.directives = new I6.Directives({ version: D });
					_ = { resolveKnownTags: !0, schema: "core" };
					break;
				case null:
					if (this.directives) delete this.directives;
					_ = null;
					break;
				default: {
					let B = JSON.stringify(D);
					throw new Error(
						`Expected '1.1', '1.2' or null as first argument, but found: ${B}`,
					);
				}
			}
			if (F.schema instanceof Object) this.schema = F.schema;
			else if (_) this.schema = new jV.Schema(Object.assign(_, F));
			else
				throw new Error(
					"With a null YAML version, the { schema: Schema } option is required",
				);
		}
		toJS({
			json: D,
			jsonArg: F,
			mapAsMap: _,
			maxAliasCount: B,
			onAnchor: $,
			reviver: Z,
		} = {}) {
			let q = {
					anchors: new Map(),
					doc: this,
					keep: !D,
					mapAsMap: _ === !0,
					mapKeyWarned: !1,
					maxAliasCount: typeof B === "number" ? B : 100,
				},
				X = wV.toJS(this.contents, F ?? "", q);
			if (typeof $ === "function")
				for (let { count: Q, res: J } of q.anchors.values()) $(J, Q);
			return typeof Z === "function" ? NV.applyReviver(Z, { "": X }, "", X) : X;
		}
		toJSON(D, F) {
			return this.toJS({ json: !0, jsonArg: D, mapAsMap: !1, onAnchor: F });
		}
		toString(D = {}) {
			if (this.errors.length > 0)
				throw new Error("Document with errors cannot be stringified");
			if (
				"indent" in D &&
				(!Number.isInteger(D.indent) || Number(D.indent) <= 0)
			) {
				let F = JSON.stringify(D.indent);
				throw new Error(`"indent" option must be a positive integer, not ${F}`);
			}
			return uV.stringifyDocument(this, D);
		}
	}
	function H2(D) {
		if (K0.isCollection(D)) return !0;
		throw new Error("Expected a YAML collection as document contents");
	}
	EV.Document = U6;
});
var C1 = W((gV) => {
	class hF extends Error {
		constructor(D, F, _, B) {
			super();
			(this.name = D), (this.code = _), (this.message = B), (this.pos = F);
		}
	}
	class L_ extends hF {
		constructor(D, F, _) {
			super("YAMLParseError", D, F, _);
		}
	}
	class G_ extends hF {
		constructor(D, F, _) {
			super("YAMLWarning", D, F, _);
		}
	}
	var bV = (D, F) => (_) => {
		if (_.pos[0] === -1) return;
		_.linePos = _.pos.map((X) => F.linePos(X));
		let { line: B, col: $ } = _.linePos[0];
		_.message += ` at line ${B}, column ${$}`;
		let Z = $ - 1,
			q = D.substring(F.lineStarts[B - 1], F.lineStarts[B]).replace(
				/[\n\r]+$/,
				"",
			);
		if (Z >= 60 && q.length > 80) {
			let X = Math.min(Z - 39, q.length - 79);
			(q = "\u2026" + q.substring(X)), (Z -= X - 1);
		}
		if (q.length > 80) q = q.substring(0, 79) + "\u2026";
		if (B > 1 && /^ *$/.test(q.substring(0, Z))) {
			let X = D.substring(F.lineStarts[B - 2], F.lineStarts[B - 1]);
			if (X.length > 80)
				X =
					X.substring(0, 79) +
					`\u2026
`;
			q = X + q;
		}
		if (/[^ ]/.test(q)) {
			let X = 1,
				Q = _.linePos[1];
			if (Q && Q.line === B && Q.col > $)
				X = Math.max(1, Math.min(Q.col - $, 80 - Z));
			let J = " ".repeat(Z) + "^".repeat(X);
			_.message += `:

${q}
${J}
`;
		}
	};
	gV.YAMLError = hF;
	gV.YAMLParseError = L_;
	gV.YAMLWarning = G_;
	gV.prettifyError = bV;
});
var W1 = W((hV) => {
	function mV(
		D,
		{
			flow: F,
			indicator: _,
			next: B,
			offset: $,
			onError: Z,
			parentIndent: q,
			startOnNewline: X,
		},
	) {
		let Q = !1,
			J = X,
			z = X,
			A = "",
			L = "",
			G = !1,
			H = !1,
			V = null,
			C = null,
			K = null,
			I = null,
			M = null,
			P = null,
			O = null;
		for (let Y of D) {
			if (H) {
				if (Y.type !== "space" && Y.type !== "newline" && Y.type !== "comma")
					Z(
						Y.offset,
						"MISSING_CHAR",
						"Tags and anchors must be separated from the next token by white space",
					);
				H = !1;
			}
			if (V) {
				if (J && Y.type !== "comment" && Y.type !== "newline")
					Z(V, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
				V = null;
			}
			switch (Y.type) {
				case "space":
					if (
						!F &&
						(_ !== "doc-start" || B?.type !== "flow-collection") &&
						Y.source.includes("\t")
					)
						V = Y;
					z = !0;
					break;
				case "comment": {
					if (!z)
						Z(
							Y,
							"MISSING_CHAR",
							"Comments must be separated from other tokens by white space characters",
						);
					let y = Y.source.substring(1) || " ";
					if (!A) A = y;
					else A += L + y;
					(L = ""), (J = !1);
					break;
				}
				case "newline":
					if (J) {
						if (A) A += Y.source;
						else if (!P || _ !== "seq-item-ind") Q = !0;
					} else L += Y.source;
					if (((J = !0), (G = !0), C || K)) I = Y;
					z = !0;
					break;
				case "anchor":
					if (C) Z(Y, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
					if (Y.source.endsWith(":"))
						Z(
							Y.offset + Y.source.length - 1,
							"BAD_ALIAS",
							"Anchor ending in : is ambiguous",
							!0,
						);
					if (((C = Y), O === null)) O = Y.offset;
					(J = !1), (z = !1), (H = !0);
					break;
				case "tag": {
					if (K) Z(Y, "MULTIPLE_TAGS", "A node can have at most one tag");
					if (((K = Y), O === null)) O = Y.offset;
					(J = !1), (z = !1), (H = !0);
					break;
				}
				case _:
					if (C || K)
						Z(
							Y,
							"BAD_PROP_ORDER",
							`Anchors and tags must be after the ${Y.source} indicator`,
						);
					if (P)
						Z(
							Y,
							"UNEXPECTED_TOKEN",
							`Unexpected ${Y.source} in ${F ?? "collection"}`,
						);
					(P = Y),
						(J = _ === "seq-item-ind" || _ === "explicit-key-ind"),
						(z = !1);
					break;
				case "comma":
					if (F) {
						if (M) Z(Y, "UNEXPECTED_TOKEN", `Unexpected , in ${F}`);
						(M = Y), (J = !1), (z = !1);
						break;
					}
				default:
					Z(Y, "UNEXPECTED_TOKEN", `Unexpected ${Y.type} token`),
						(J = !1),
						(z = !1);
			}
		}
		let w = D[D.length - 1],
			x = w ? w.offset + w.source.length : $;
		if (
			H &&
			B &&
			B.type !== "space" &&
			B.type !== "newline" &&
			B.type !== "comma" &&
			(B.type !== "scalar" || B.source !== "")
		)
			Z(
				B.offset,
				"MISSING_CHAR",
				"Tags and anchors must be separated from the next token by white space",
			);
		if (
			V &&
			((J && V.indent <= q) ||
				B?.type === "block-map" ||
				B?.type === "block-seq")
		)
			Z(V, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
		return {
			comma: M,
			found: P,
			spaceBefore: Q,
			comment: A,
			hasNewline: G,
			anchor: C,
			tag: K,
			newlineAfterProp: I,
			end: x,
			start: O ?? x,
		};
	}
	hV.resolveProps = mV;
});
var lF = W((dV) => {
	function M6(D) {
		if (!D) return null;
		switch (D.type) {
			case "alias":
			case "scalar":
			case "double-quoted-scalar":
			case "single-quoted-scalar":
				if (
					D.source.includes(`
`)
				)
					return !0;
				if (D.end) {
					for (let F of D.end) if (F.type === "newline") return !0;
				}
				return !1;
			case "flow-collection":
				for (let F of D.items) {
					for (let _ of F.start) if (_.type === "newline") return !0;
					if (F.sep) {
						for (let _ of F.sep) if (_.type === "newline") return !0;
					}
					if (M6(F.key) || M6(F.value)) return !0;
				}
				return !1;
			default:
				return !0;
		}
	}
	dV.containsNewline = M6;
});
var R6 = W((iV) => {
	var pV = lF();
	function aV(D, F, _) {
		if (F?.type === "flow-collection") {
			let B = F.end[0];
			if (
				B.indent === D &&
				(B.source === "]" || B.source === "}") &&
				pV.containsNewline(F)
			)
				_(
					B,
					"BAD_INDENT",
					"Flow end indicator should be more indented than parent",
					!0,
				);
		}
	}
	iV.flowIndentCheck = aV;
});
var P6 = W((nV) => {
	var V_ = j();
	function rV(D, F, _) {
		let { uniqueKeys: B } = D.options;
		if (B === !1) return !1;
		let $ =
			typeof B === "function"
				? B
				: (Z, q) =>
						Z === q ||
						(V_.isScalar(Z) && V_.isScalar(q) && Z.value === q.value);
		return F.some((Z) => $(Z.key, _));
	}
	nV.mapIncludes = rV;
});
var Y_ = W((_C) => {
	var C_ = ID(),
		tV = MD(),
		W_ = W1(),
		eV = lF(),
		H_ = R6(),
		DC = P6(),
		K_ = "All mapping items must start at the same column";
	function FC({ composeNode: D, composeEmptyNode: F }, _, B, $, Z) {
		let X = new (Z?.nodeClass ?? tV.YAMLMap)(_.schema);
		if (_.atRoot) _.atRoot = !1;
		let Q = B.offset,
			J = null;
		for (let z of B.items) {
			let { start: A, key: L, sep: G, value: H } = z,
				V = W_.resolveProps(A, {
					indicator: "explicit-key-ind",
					next: L ?? G?.[0],
					offset: Q,
					onError: $,
					parentIndent: B.indent,
					startOnNewline: !0,
				}),
				C = !V.found;
			if (C) {
				if (L) {
					if (L.type === "block-seq")
						$(
							Q,
							"BLOCK_AS_IMPLICIT_KEY",
							"A block sequence may not be used as an implicit map key",
						);
					else if ("indent" in L && L.indent !== B.indent)
						$(Q, "BAD_INDENT", K_);
				}
				if (!V.anchor && !V.tag && !G) {
					if (((J = V.end), V.comment))
						if (X.comment)
							X.comment +=
								`
` + V.comment;
						else X.comment = V.comment;
					continue;
				}
				if (V.newlineAfterProp || eV.containsNewline(L))
					$(
						L ?? A[A.length - 1],
						"MULTILINE_IMPLICIT_KEY",
						"Implicit keys need to be on a single line",
					);
			} else if (V.found?.indent !== B.indent) $(Q, "BAD_INDENT", K_);
			_.atKey = !0;
			let K = V.end,
				I = L ? D(_, L, V, $) : F(_, K, A, null, V, $);
			if (_.schema.compat) H_.flowIndentCheck(B.indent, L, $);
			if (((_.atKey = !1), DC.mapIncludes(_, X.items, I)))
				$(K, "DUPLICATE_KEY", "Map keys must be unique");
			let M = W_.resolveProps(G ?? [], {
				indicator: "map-value-ind",
				next: H,
				offset: I.range[2],
				onError: $,
				parentIndent: B.indent,
				startOnNewline: !L || L.type === "block-scalar",
			});
			if (((Q = M.end), M.found)) {
				if (C) {
					if (H?.type === "block-map" && !M.hasNewline)
						$(
							Q,
							"BLOCK_AS_IMPLICIT_KEY",
							"Nested mappings are not allowed in compact mappings",
						);
					if (_.options.strict && V.start < M.found.offset - 1024)
						$(
							I.range,
							"KEY_OVER_1024_CHARS",
							"The : indicator must be at most 1024 chars after the start of an implicit block mapping key",
						);
				}
				let P = H ? D(_, H, M, $) : F(_, Q, G, null, M, $);
				if (_.schema.compat) H_.flowIndentCheck(B.indent, H, $);
				Q = P.range[2];
				let O = new C_.Pair(I, P);
				if (_.options.keepSourceTokens) O.srcToken = z;
				X.items.push(O);
			} else {
				if (C)
					$(
						I.range,
						"MISSING_CHAR",
						"Implicit map keys need to be followed by map values",
					);
				if (M.comment)
					if (I.comment)
						I.comment +=
							`
` + M.comment;
					else I.comment = M.comment;
				let P = new C_.Pair(I);
				if (_.options.keepSourceTokens) P.srcToken = z;
				X.items.push(P);
			}
		}
		if (J && J < Q) $(J, "IMPOSSIBLE", "Map comment with trailing content");
		return (X.range = [B.offset, Q, J ?? Q]), X;
	}
	_C.resolveBlockMap = FC;
});
var I_ = W((QC) => {
	var $C = RD(),
		qC = W1(),
		ZC = R6();
	function XC({ composeNode: D, composeEmptyNode: F }, _, B, $, Z) {
		let X = new (Z?.nodeClass ?? $C.YAMLSeq)(_.schema);
		if (_.atRoot) _.atRoot = !1;
		if (_.atKey) _.atKey = !1;
		let Q = B.offset,
			J = null;
		for (let { start: z, value: A } of B.items) {
			let L = qC.resolveProps(z, {
				indicator: "seq-item-ind",
				next: A,
				offset: Q,
				onError: $,
				parentIndent: B.indent,
				startOnNewline: !0,
			});
			if (!L.found)
				if (L.anchor || L.tag || A)
					if (A && A.type === "block-seq")
						$(
							L.end,
							"BAD_INDENT",
							"All sequence items must start at the same column",
						);
					else $(Q, "MISSING_CHAR", "Sequence item without - indicator");
				else {
					if (((J = L.end), L.comment)) X.comment = L.comment;
					continue;
				}
			let G = A ? D(_, A, L, $) : F(_, L.end, z, null, L, $);
			if (_.schema.compat) ZC.flowIndentCheck(B.indent, A, $);
			(Q = G.range[2]), X.items.push(G);
		}
		return (X.range = [B.offset, Q, J ?? Q]), X;
	}
	QC.resolveBlockSeq = XC;
});
var K2 = W((AC) => {
	function zC(D, F, _, B) {
		let $ = "";
		if (D) {
			let Z = !1,
				q = "";
			for (let X of D) {
				let { source: Q, type: J } = X;
				switch (J) {
					case "space":
						Z = !0;
						break;
					case "comment": {
						if (_ && !Z)
							B(
								X,
								"MISSING_CHAR",
								"Comments must be separated from other tokens by white space characters",
							);
						let z = Q.substring(1) || " ";
						if (!$) $ = z;
						else $ += q + z;
						q = "";
						break;
					}
					case "newline":
						if ($) q += Q;
						Z = !0;
						break;
					default:
						B(X, "UNEXPECTED_TOKEN", `Unexpected ${J} at node end`);
				}
				F += Q.length;
			}
		}
		return { comment: $, offset: F };
	}
	AC.resolveEnd = zC;
});
var R_ = W((IC) => {
	var GC = j(),
		VC = ID(),
		U_ = MD(),
		CC = RD(),
		WC = K2(),
		M_ = W1(),
		HC = lF(),
		KC = P6(),
		T6 = "Block collections are not allowed within flow collections",
		O6 = (D) => D && (D.type === "block-map" || D.type === "block-seq");
	function YC({ composeNode: D, composeEmptyNode: F }, _, B, $, Z) {
		let q = B.start.source === "{",
			X = q ? "flow map" : "flow sequence",
			J = new (Z?.nodeClass ?? (q ? U_.YAMLMap : CC.YAMLSeq))(_.schema);
		J.flow = !0;
		let z = _.atRoot;
		if (z) _.atRoot = !1;
		if (_.atKey) _.atKey = !1;
		let A = B.offset + B.start.source.length;
		for (let C = 0; C < B.items.length; ++C) {
			let K = B.items[C],
				{ start: I, key: M, sep: P, value: O } = K,
				w = M_.resolveProps(I, {
					flow: X,
					indicator: "explicit-key-ind",
					next: M ?? P?.[0],
					offset: A,
					onError: $,
					parentIndent: B.indent,
					startOnNewline: !1,
				});
			if (!w.found) {
				if (!w.anchor && !w.tag && !P && !O) {
					if (C === 0 && w.comma)
						$(w.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${X}`);
					else if (C < B.items.length - 1)
						$(w.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${X}`);
					if (w.comment)
						if (J.comment)
							J.comment +=
								`
` + w.comment;
						else J.comment = w.comment;
					A = w.end;
					continue;
				}
				if (!q && _.options.strict && HC.containsNewline(M))
					$(
						M,
						"MULTILINE_IMPLICIT_KEY",
						"Implicit keys of flow sequence pairs need to be on a single line",
					);
			}
			if (C === 0) {
				if (w.comma) $(w.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${X}`);
			} else {
				if (!w.comma)
					$(w.start, "MISSING_CHAR", `Missing , between ${X} items`);
				if (w.comment) {
					let x = "";
					D: for (let Y of I)
						switch (Y.type) {
							case "comma":
							case "space":
								break;
							case "comment":
								x = Y.source.substring(1);
								break D;
							default:
								break D;
						}
					if (x) {
						let Y = J.items[J.items.length - 1];
						if (GC.isPair(Y)) Y = Y.value ?? Y.key;
						if (Y.comment)
							Y.comment +=
								`
` + x;
						else Y.comment = x;
						w.comment = w.comment.substring(x.length + 1);
					}
				}
			}
			if (!q && !P && !w.found) {
				let x = O ? D(_, O, w, $) : F(_, w.end, P, null, w, $);
				if ((J.items.push(x), (A = x.range[2]), O6(O)))
					$(x.range, "BLOCK_IN_FLOW", T6);
			} else {
				_.atKey = !0;
				let x = w.end,
					Y = M ? D(_, M, w, $) : F(_, x, I, null, w, $);
				if (O6(M)) $(Y.range, "BLOCK_IN_FLOW", T6);
				_.atKey = !1;
				let y = M_.resolveProps(P ?? [], {
					flow: X,
					indicator: "map-value-ind",
					next: O,
					offset: Y.range[2],
					onError: $,
					parentIndent: B.indent,
					startOnNewline: !1,
				});
				if (y.found) {
					if (!q && !w.found && _.options.strict) {
						if (P)
							for (let a of P) {
								if (a === y.found) break;
								if (a.type === "newline") {
									$(
										a,
										"MULTILINE_IMPLICIT_KEY",
										"Implicit keys of flow sequence pairs need to be on a single line",
									);
									break;
								}
							}
						if (w.start < y.found.offset - 1024)
							$(
								y.found,
								"KEY_OVER_1024_CHARS",
								"The : indicator must be at most 1024 chars after the start of an implicit flow sequence key",
							);
					}
				} else if (O)
					if ("source" in O && O.source && O.source[0] === ":")
						$(O, "MISSING_CHAR", `Missing space after : in ${X}`);
					else $(y.start, "MISSING_CHAR", `Missing , or : between ${X} items`);
				let b0 = O
					? D(_, O, y, $)
					: y.found
						? F(_, y.end, P, null, y, $)
						: null;
				if (b0) {
					if (O6(O)) $(b0.range, "BLOCK_IN_FLOW", T6);
				} else if (y.comment)
					if (Y.comment)
						Y.comment +=
							`
` + y.comment;
					else Y.comment = y.comment;
				let WD = new VC.Pair(Y, b0);
				if (_.options.keepSourceTokens) WD.srcToken = K;
				if (q) {
					let a = J;
					if (KC.mapIncludes(_, a.items, Y))
						$(x, "DUPLICATE_KEY", "Map keys must be unique");
					a.items.push(WD);
				} else {
					let a = new U_.YAMLMap(_.schema);
					(a.flow = !0), a.items.push(WD);
					let j4 = (b0 ?? Y).range;
					(a.range = [Y.range[0], j4[1], j4[2]]), J.items.push(a);
				}
				A = b0 ? b0.range[2] : y.end;
			}
		}
		let L = q ? "}" : "]",
			[G, ...H] = B.end,
			V = A;
		if (G && G.source === L) V = G.offset + G.source.length;
		else {
			let C = X[0].toUpperCase() + X.substring(1),
				K = z
					? `${C} must end with a ${L}`
					: `${C} in block collection must be sufficiently indented and end with a ${L}`;
			if (
				($(A, z ? "MISSING_CHAR" : "BAD_INDENT", K), G && G.source.length !== 1)
			)
				H.unshift(G);
		}
		if (H.length > 0) {
			let C = WC.resolveEnd(H, V, _.options.strict, $);
			if (C.comment)
				if (J.comment)
					J.comment +=
						`
` + C.comment;
				else J.comment = C.comment;
			J.range = [B.offset, V, C.offset];
		} else J.range = [B.offset, V, V];
		return J;
	}
	IC.resolveFlowCollection = YC;
});
var P_ = W((NC) => {
	var MC = j(),
		RC = p(),
		PC = MD(),
		TC = RD(),
		OC = Y_(),
		wC = I_(),
		jC = R_();
	function w6(D, F, _, B, $, Z) {
		let q =
				_.type === "block-map"
					? OC.resolveBlockMap(D, F, _, B, Z)
					: _.type === "block-seq"
						? wC.resolveBlockSeq(D, F, _, B, Z)
						: jC.resolveFlowCollection(D, F, _, B, Z),
			X = q.constructor;
		if ($ === "!" || $ === X.tagName) return (q.tag = X.tagName), q;
		if ($) q.tag = $;
		return q;
	}
	function uC(D, F, _, B, $) {
		let Z = B.tag,
			q = !Z
				? null
				: F.directives.tagName(Z.source, (L) => $(Z, "TAG_RESOLVE_FAILED", L));
		if (_.type === "block-seq") {
			let { anchor: L, newlineAfterProp: G } = B,
				H = L && Z ? (L.offset > Z.offset ? L : Z) : (L ?? Z);
			if (H && (!G || G.offset < H.offset))
				$(H, "MISSING_CHAR", "Missing newline after block sequence props");
		}
		let X =
			_.type === "block-map"
				? "map"
				: _.type === "block-seq"
					? "seq"
					: _.start.source === "{"
						? "map"
						: "seq";
		if (
			!Z ||
			!q ||
			q === "!" ||
			(q === PC.YAMLMap.tagName && X === "map") ||
			(q === TC.YAMLSeq.tagName && X === "seq")
		)
			return w6(D, F, _, $, q);
		let Q = F.schema.tags.find((L) => L.tag === q && L.collection === X);
		if (!Q) {
			let L = F.schema.knownTags[q];
			if (L && L.collection === X)
				F.schema.tags.push(Object.assign({}, L, { default: !1 })), (Q = L);
			else {
				if (L?.collection)
					$(
						Z,
						"BAD_COLLECTION_TYPE",
						`${L.tag} used for ${X} collection, but expects ${L.collection}`,
						!0,
					);
				else $(Z, "TAG_RESOLVE_FAILED", `Unresolved tag: ${q}`, !0);
				return w6(D, F, _, $, q);
			}
		}
		let J = w6(D, F, _, $, q, Q),
			z = Q.resolve?.(J, (L) => $(Z, "TAG_RESOLVE_FAILED", L), F.options) ?? J,
			A = MC.isNode(z) ? z : new RC.Scalar(z);
		if (((A.range = J.range), (A.tag = q), Q?.format)) A.format = Q.format;
		return A;
	}
	NC.composeCollection = uC;
});
var u6 = W((gC) => {
	var j6 = p();
	function EC(D, F, _) {
		let B = F.offset,
			$ = xC(F, D.options.strict, _);
		if (!$) return { value: "", type: null, comment: "", range: [B, B, B] };
		let Z = $.mode === ">" ? j6.Scalar.BLOCK_FOLDED : j6.Scalar.BLOCK_LITERAL,
			q = F.source ? bC(F.source) : [],
			X = q.length;
		for (let V = q.length - 1; V >= 0; --V) {
			let C = q[V][1];
			if (C === "" || C === "\r") X = V;
			else break;
		}
		if (X === 0) {
			let V =
					$.chomp === "+" && q.length > 0
						? `
`.repeat(Math.max(1, q.length - 1))
						: "",
				C = B + $.length;
			if (F.source) C += F.source.length;
			return { value: V, type: Z, comment: $.comment, range: [B, C, C] };
		}
		let Q = F.indent + $.indent,
			J = F.offset + $.length,
			z = 0;
		for (let V = 0; V < X; ++V) {
			let [C, K] = q[V];
			if (K === "" || K === "\r") {
				if ($.indent === 0 && C.length > Q) Q = C.length;
			} else {
				if (C.length < Q)
					_(
						J + C.length,
						"MISSING_CHAR",
						"Block scalars with more-indented leading empty lines must use an explicit indentation indicator",
					);
				if ($.indent === 0) Q = C.length;
				if (((z = V), Q === 0 && !D.atRoot))
					_(
						J,
						"BAD_INDENT",
						"Block scalar values in collections must be indented",
					);
				break;
			}
			J += C.length + K.length + 1;
		}
		for (let V = q.length - 1; V >= X; --V) if (q[V][0].length > Q) X = V + 1;
		let A = "",
			L = "",
			G = !1;
		for (let V = 0; V < z; ++V)
			A +=
				q[V][0].slice(Q) +
				`
`;
		for (let V = z; V < X; ++V) {
			let [C, K] = q[V];
			J += C.length + K.length + 1;
			let I = K[K.length - 1] === "\r";
			if (I) K = K.slice(0, -1);
			if (K && C.length < Q) {
				let P = `Block scalar lines must not be less indented than their ${$.indent ? "explicit indentation indicator" : "first line"}`;
				_(J - K.length - (I ? 2 : 1), "BAD_INDENT", P), (C = "");
			}
			if (Z === j6.Scalar.BLOCK_LITERAL)
				(A += L + C.slice(Q) + K),
					(L = `
`);
			else if (C.length > Q || K[0] === "\t") {
				if (L === " ")
					L = `
`;
				else if (
					!G &&
					L ===
						`
`
				)
					L = `

`;
				(A += L + C.slice(Q) + K),
					(L = `
`),
					(G = !0);
			} else if (K === "")
				if (
					L ===
					`
`
				)
					A += `
`;
				else
					L = `
`;
			else (A += L + K), (L = " "), (G = !1);
		}
		switch ($.chomp) {
			case "-":
				break;
			case "+":
				for (let V = X; V < q.length; ++V)
					A +=
						`
` + q[V][0].slice(Q);
				if (
					A[A.length - 1] !==
					`
`
				)
					A += `
`;
				break;
			default:
				A += `
`;
		}
		let H = B + $.length + F.source.length;
		return { value: A, type: Z, comment: $.comment, range: [B, H, H] };
	}
	function xC({ offset: D, props: F }, _, B) {
		if (F[0].type !== "block-scalar-header")
			return B(F[0], "IMPOSSIBLE", "Block scalar header not found"), null;
		let { source: $ } = F[0],
			Z = $[0],
			q = 0,
			X = "",
			Q = -1;
		for (let L = 1; L < $.length; ++L) {
			let G = $[L];
			if (!X && (G === "-" || G === "+")) X = G;
			else {
				let H = Number(G);
				if (!q && H) q = H;
				else if (Q === -1) Q = D + L;
			}
		}
		if (Q !== -1)
			B(
				Q,
				"UNEXPECTED_TOKEN",
				`Block scalar header includes extra characters: ${$}`,
			);
		let J = !1,
			z = "",
			A = $.length;
		for (let L = 1; L < F.length; ++L) {
			let G = F[L];
			switch (G.type) {
				case "space":
					J = !0;
				case "newline":
					A += G.source.length;
					break;
				case "comment":
					if (_ && !J)
						B(
							G,
							"MISSING_CHAR",
							"Comments must be separated from other tokens by white space characters",
						);
					(A += G.source.length), (z = G.source.substring(1));
					break;
				case "error":
					B(G, "UNEXPECTED_TOKEN", G.message), (A += G.source.length);
					break;
				default: {
					let H = `Unexpected token in block scalar header: ${G.type}`;
					B(G, "UNEXPECTED_TOKEN", H);
					let V = G.source;
					if (V && typeof V === "string") A += V.length;
				}
			}
		}
		return { mode: Z, indent: q, chomp: X, comment: z, length: A };
	}
	function bC(D) {
		let F = D.split(/\n( *)/),
			_ = F[0],
			B = _.match(/^( *)/),
			Z = [B?.[1] ? [B[1], _.slice(B[1].length)] : ["", _]];
		for (let q = 1; q < F.length; q += 2) Z.push([F[q], F[q + 1]]);
		return Z;
	}
	gC.resolveBlockScalar = EC;
});
var S6 = W((pC) => {
	var N6 = p(),
		yC = K2();
	function kC(D, F, _) {
		let { offset: B, type: $, source: Z, end: q } = D,
			X,
			Q,
			J = (L, G, H) => _(B + L, G, H);
		switch ($) {
			case "scalar":
				(X = N6.Scalar.PLAIN), (Q = fC(Z, J));
				break;
			case "single-quoted-scalar":
				(X = N6.Scalar.QUOTE_SINGLE), (Q = mC(Z, J));
				break;
			case "double-quoted-scalar":
				(X = N6.Scalar.QUOTE_DOUBLE), (Q = hC(Z, J));
				break;
			default:
				return (
					_(
						D,
						"UNEXPECTED_TOKEN",
						`Expected a flow scalar value, but found: ${$}`,
					),
					{
						value: "",
						type: null,
						comment: "",
						range: [B, B + Z.length, B + Z.length],
					}
				);
		}
		let z = B + Z.length,
			A = yC.resolveEnd(q, z, F, _);
		return { value: Q, type: X, comment: A.comment, range: [B, z, A.offset] };
	}
	function fC(D, F) {
		let _ = "";
		switch (D[0]) {
			case "\t":
				_ = "a tab character";
				break;
			case ",":
				_ = "flow indicator character ,";
				break;
			case "%":
				_ = "directive indicator character %";
				break;
			case "|":
			case ">": {
				_ = `block scalar indicator ${D[0]}`;
				break;
			}
			case "@":
			case "`": {
				_ = `reserved character ${D[0]}`;
				break;
			}
		}
		if (_) F(0, "BAD_SCALAR_START", `Plain value cannot start with ${_}`);
		return T_(D);
	}
	function mC(D, F) {
		if (D[D.length - 1] !== "'" || D.length === 1)
			F(D.length, "MISSING_CHAR", "Missing closing 'quote");
		return T_(D.slice(1, -1)).replace(/''/g, "'");
	}
	function T_(D) {
		let F, _;
		try {
			(F = new RegExp(
				`(.*?)(?<![ 	])[ 	]*\r?
`,
				"sy",
			)),
				(_ = new RegExp(
					`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`,
					"sy",
				));
		} catch {
			(F = /(.*?)[ \t]*\r?\n/sy), (_ = /[ \t]*(.*?)[ \t]*\r?\n/sy);
		}
		let B = F.exec(D);
		if (!B) return D;
		let $ = B[1],
			Z = " ",
			q = F.lastIndex;
		_.lastIndex = q;
		while ((B = _.exec(D))) {
			if (B[1] === "")
				if (
					Z ===
					`
`
				)
					$ += Z;
				else
					Z = `
`;
			else ($ += Z + B[1]), (Z = " ");
			q = _.lastIndex;
		}
		let X = /[ \t]*(.*)/sy;
		return (X.lastIndex = q), (B = X.exec(D)), $ + Z + (B?.[1] ?? "");
	}
	function hC(D, F) {
		let _ = "";
		for (let B = 1; B < D.length - 1; ++B) {
			let $ = D[B];
			if (
				$ === "\r" &&
				D[B + 1] ===
					`
`
			)
				continue;
			if (
				$ ===
				`
`
			) {
				let { fold: Z, offset: q } = lC(D, B);
				(_ += Z), (B = q);
			} else if ($ === "\\") {
				let Z = D[++B],
					q = dC[Z];
				if (q) _ += q;
				else if (
					Z ===
					`
`
				) {
					Z = D[B + 1];
					while (Z === " " || Z === "\t") Z = D[++B + 1];
				} else if (
					Z === "\r" &&
					D[B + 1] ===
						`
`
				) {
					Z = D[++B + 1];
					while (Z === " " || Z === "\t") Z = D[++B + 1];
				} else if (Z === "x" || Z === "u" || Z === "U") {
					let X = { x: 2, u: 4, U: 8 }[Z];
					(_ += cC(D, B + 1, X, F)), (B += X);
				} else {
					let X = D.substr(B - 1, 2);
					F(B - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${X}`), (_ += X);
				}
			} else if ($ === " " || $ === "\t") {
				let Z = B,
					q = D[B + 1];
				while (q === " " || q === "\t") q = D[++B + 1];
				if (
					q !==
						`
` &&
					!(
						q === "\r" &&
						D[B + 2] ===
							`
`
					)
				)
					_ += B > Z ? D.slice(Z, B + 1) : $;
			} else _ += $;
		}
		if (D[D.length - 1] !== '"' || D.length === 1)
			F(D.length, "MISSING_CHAR", 'Missing closing "quote');
		return _;
	}
	function lC(D, F) {
		let _ = "",
			B = D[F + 1];
		while (
			B === " " ||
			B === "\t" ||
			B ===
				`
` ||
			B === "\r"
		) {
			if (
				B === "\r" &&
				D[F + 2] !==
					`
`
			)
				break;
			if (
				B ===
				`
`
			)
				_ += `
`;
			(F += 1), (B = D[F + 1]);
		}
		if (!_) _ = " ";
		return { fold: _, offset: F };
	}
	var dC = {
		0: "\x00",
		a: "\x07",
		b: "\b",
		e: "\x1B",
		f: "\f",
		n: `
`,
		r: "\r",
		t: "\t",
		v: "\v",
		N: "\x85",
		_: "\xA0",
		L: "\u2028",
		P: "\u2029",
		" ": " ",
		'"': '"',
		"/": "/",
		"\\": "\\",
		"\t": "\t",
	};
	function cC(D, F, _, B) {
		let $ = D.substr(F, _),
			q = $.length === _ && /^[0-9a-fA-F]+$/.test($) ? parseInt($, 16) : NaN;
		if (isNaN(q)) {
			let X = D.substr(F - 2, _ + 2);
			return B(F - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${X}`), X;
		}
		return String.fromCodePoint(q);
	}
	pC.resolveFlowScalar = kC;
});
var w_ = W((tC) => {
	var iD = j(),
		O_ = p(),
		iC = u6(),
		sC = S6();
	function rC(D, F, _, B) {
		let {
				value: $,
				type: Z,
				comment: q,
				range: X,
			} = F.type === "block-scalar"
				? iC.resolveBlockScalar(D, F, B)
				: sC.resolveFlowScalar(F, D.options.strict, B),
			Q = _
				? D.directives.tagName(_.source, (A) => B(_, "TAG_RESOLVE_FAILED", A))
				: null,
			J;
		if (D.options.stringKeys && D.atKey) J = D.schema[iD.SCALAR];
		else if (Q) J = nC(D.schema, $, Q, _, B);
		else if (F.type === "scalar") J = oC(D, $, F, B);
		else J = D.schema[iD.SCALAR];
		let z;
		try {
			let A = J.resolve(
				$,
				(L) => B(_ ?? F, "TAG_RESOLVE_FAILED", L),
				D.options,
			);
			z = iD.isScalar(A) ? A : new O_.Scalar(A);
		} catch (A) {
			let L = A instanceof Error ? A.message : String(A);
			B(_ ?? F, "TAG_RESOLVE_FAILED", L), (z = new O_.Scalar($));
		}
		if (((z.range = X), (z.source = $), Z)) z.type = Z;
		if (Q) z.tag = Q;
		if (J.format) z.format = J.format;
		if (q) z.comment = q;
		return z;
	}
	function nC(D, F, _, B, $) {
		if (_ === "!") return D[iD.SCALAR];
		let Z = [];
		for (let X of D.tags)
			if (!X.collection && X.tag === _)
				if (X.default && X.test) Z.push(X);
				else return X;
		for (let X of Z) if (X.test?.test(F)) return X;
		let q = D.knownTags[_];
		if (q && !q.collection)
			return (
				D.tags.push(Object.assign({}, q, { default: !1, test: void 0 })), q
			);
		return (
			$(
				B,
				"TAG_RESOLVE_FAILED",
				`Unresolved tag: ${_}`,
				_ !== "tag:yaml.org,2002:str",
			),
			D[iD.SCALAR]
		);
	}
	function oC({ atKey: D, directives: F, schema: _ }, B, $, Z) {
		let q =
			_.tags.find(
				(X) =>
					(X.default === !0 || (D && X.default === "key")) && X.test?.test(B),
			) || _[iD.SCALAR];
		if (_.compat) {
			let X =
				_.compat.find((Q) => Q.default && Q.test?.test(B)) ?? _[iD.SCALAR];
			if (q.tag !== X.tag) {
				let Q = F.tagString(q.tag),
					J = F.tagString(X.tag),
					z = `Value may be parsed as either ${Q} or ${J}`;
				Z($, "TAG_RESOLVE_FAILED", z, !0);
			}
		}
		return q;
	}
	tC.composeScalar = rC;
});
var j_ = W((FW) => {
	function DW(D, F, _) {
		if (F) {
			if (_ === null) _ = F.length;
			for (let B = _ - 1; B >= 0; --B) {
				let $ = F[B];
				switch ($.type) {
					case "space":
					case "comment":
					case "newline":
						D -= $.source.length;
						continue;
				}
				$ = F[++B];
				while ($?.type === "space") (D += $.source.length), ($ = F[++B]);
				break;
			}
		}
		return D;
	}
	FW.emptyScalarPosition = DW;
});
var S_ = W((zW) => {
	var BW = e2(),
		$W = j(),
		qW = P_(),
		u_ = w_(),
		ZW = K2(),
		XW = j_(),
		QW = { composeNode: N_, composeEmptyNode: E6 };
	function N_(D, F, _, B) {
		let $ = D.atKey,
			{ spaceBefore: Z, comment: q, anchor: X, tag: Q } = _,
			J,
			z = !0;
		switch (F.type) {
			case "alias":
				if (((J = JW(D, F, B)), X || Q))
					B(F, "ALIAS_PROPS", "An alias node must not specify any properties");
				break;
			case "scalar":
			case "single-quoted-scalar":
			case "double-quoted-scalar":
			case "block-scalar":
				if (((J = u_.composeScalar(D, F, Q, B)), X))
					J.anchor = X.source.substring(1);
				break;
			case "block-map":
			case "block-seq":
			case "flow-collection":
				if (((J = qW.composeCollection(QW, D, F, _, B)), X))
					J.anchor = X.source.substring(1);
				break;
			default: {
				let A =
					F.type === "error"
						? F.message
						: `Unsupported token (type: ${F.type})`;
				B(F, "UNEXPECTED_TOKEN", A),
					(J = E6(D, F.offset, void 0, null, _, B)),
					(z = !1);
			}
		}
		if (X && J.anchor === "")
			B(X, "BAD_ALIAS", "Anchor cannot be an empty string");
		if (
			$ &&
			D.options.stringKeys &&
			(!$W.isScalar(J) ||
				typeof J.value !== "string" ||
				(J.tag && J.tag !== "tag:yaml.org,2002:str"))
		)
			B(Q ?? F, "NON_STRING_KEY", "With stringKeys, all keys must be strings");
		if (Z) J.spaceBefore = !0;
		if (q)
			if (F.type === "scalar" && F.source === "") J.comment = q;
			else J.commentBefore = q;
		if (D.options.keepSourceTokens && z) J.srcToken = F;
		return J;
	}
	function E6(
		D,
		F,
		_,
		B,
		{ spaceBefore: $, comment: Z, anchor: q, tag: X, end: Q },
		J,
	) {
		let z = {
				type: "scalar",
				offset: XW.emptyScalarPosition(F, _, B),
				indent: -1,
				source: "",
			},
			A = u_.composeScalar(D, z, X, J);
		if (q) {
			if (((A.anchor = q.source.substring(1)), A.anchor === ""))
				J(q, "BAD_ALIAS", "Anchor cannot be an empty string");
		}
		if ($) A.spaceBefore = !0;
		if (Z) (A.comment = Z), (A.range[2] = Q);
		return A;
	}
	function JW({ options: D }, { offset: F, source: _, end: B }, $) {
		let Z = new BW.Alias(_.substring(1));
		if (Z.source === "") $(F, "BAD_ALIAS", "Alias cannot be an empty string");
		if (Z.source.endsWith(":"))
			$(F + _.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
		let q = F + _.length,
			X = ZW.resolveEnd(B, q, D.strict, $);
		if (((Z.range = [F, q, X.offset]), X.comment)) Z.comment = X.comment;
		return Z;
	}
	zW.composeEmptyNode = E6;
	zW.composeNode = N_;
});
var x_ = W((HW) => {
	var GW = V1(),
		E_ = S_(),
		VW = K2(),
		CW = W1();
	function WW(D, F, { offset: _, start: B, value: $, end: Z }, q) {
		let X = Object.assign({ _directives: F }, D),
			Q = new GW.Document(void 0, X),
			J = {
				atKey: !1,
				atRoot: !0,
				directives: Q.directives,
				options: Q.options,
				schema: Q.schema,
			},
			z = CW.resolveProps(B, {
				indicator: "doc-start",
				next: $ ?? Z?.[0],
				offset: _,
				onError: q,
				parentIndent: 0,
				startOnNewline: !0,
			});
		if (z.found) {
			if (
				((Q.directives.docStart = !0),
				$ &&
					($.type === "block-map" || $.type === "block-seq") &&
					!z.hasNewline)
			)
				q(
					z.end,
					"MISSING_CHAR",
					"Block collection cannot start on same line with directives-end marker",
				);
		}
		Q.contents = $
			? E_.composeNode(J, $, z, q)
			: E_.composeEmptyNode(J, z.end, B, null, z, q);
		let A = Q.contents.range[2],
			L = VW.resolveEnd(Z, A, !1, q);
		if (L.comment) Q.comment = L.comment;
		return (Q.range = [_, A, L.offset]), Q;
	}
	HW.composeDoc = WW;
});
var x6 = W((PW) => {
	var YW = R("process"),
		IW = y8(),
		UW = V1(),
		H1 = C1(),
		b_ = j(),
		MW = x_(),
		RW = K2();
	function K1(D) {
		if (typeof D === "number") return [D, D + 1];
		if (Array.isArray(D)) return D.length === 2 ? D : [D[0], D[1]];
		let { offset: F, source: _ } = D;
		return [F, F + (typeof _ === "string" ? _.length : 1)];
	}
	function g_(D) {
		let F = "",
			_ = !1,
			B = !1;
		for (let $ = 0; $ < D.length; ++$) {
			let Z = D[$];
			switch (Z[0]) {
				case "#":
					(F +=
						(F === ""
							? ""
							: B
								? `

`
								: `
`) + (Z.substring(1) || " ")),
						(_ = !0),
						(B = !1);
					break;
				case "%":
					if (D[$ + 1]?.[0] !== "#") $ += 1;
					_ = !1;
					break;
				default:
					if (!_) B = !0;
					_ = !1;
			}
		}
		return { comment: F, afterEmptyLine: B };
	}
	class v_ {
		constructor(D = {}) {
			(this.doc = null),
				(this.atDirectives = !1),
				(this.prelude = []),
				(this.errors = []),
				(this.warnings = []),
				(this.onError = (F, _, B, $) => {
					let Z = K1(F);
					if ($) this.warnings.push(new H1.YAMLWarning(Z, _, B));
					else this.errors.push(new H1.YAMLParseError(Z, _, B));
				}),
				(this.directives = new IW.Directives({ version: D.version || "1.2" })),
				(this.options = D);
		}
		decorate(D, F) {
			let { comment: _, afterEmptyLine: B } = g_(this.prelude);
			if (_) {
				let $ = D.contents;
				if (F)
					D.comment = D.comment
						? `${D.comment}
${_}`
						: _;
				else if (B || D.directives.docStart || !$) D.commentBefore = _;
				else if (b_.isCollection($) && !$.flow && $.items.length > 0) {
					let Z = $.items[0];
					if (b_.isPair(Z)) Z = Z.key;
					let q = Z.commentBefore;
					Z.commentBefore = q
						? `${_}
${q}`
						: _;
				} else {
					let Z = $.commentBefore;
					$.commentBefore = Z
						? `${_}
${Z}`
						: _;
				}
			}
			if (F)
				Array.prototype.push.apply(D.errors, this.errors),
					Array.prototype.push.apply(D.warnings, this.warnings);
			else (D.errors = this.errors), (D.warnings = this.warnings);
			(this.prelude = []), (this.errors = []), (this.warnings = []);
		}
		streamInfo() {
			return {
				comment: g_(this.prelude).comment,
				directives: this.directives,
				errors: this.errors,
				warnings: this.warnings,
			};
		}
		*compose(D, F = !1, _ = -1) {
			for (let B of D) yield* this.next(B);
			yield* this.end(F, _);
		}
		*next(D) {
			if (YW.env.LOG_STREAM) console.dir(D, { depth: null });
			switch (D.type) {
				case "directive":
					this.directives.add(D.source, (F, _, B) => {
						let $ = K1(D);
						($[0] += F), this.onError($, "BAD_DIRECTIVE", _, B);
					}),
						this.prelude.push(D.source),
						(this.atDirectives = !0);
					break;
				case "document": {
					let F = MW.composeDoc(this.options, this.directives, D, this.onError);
					if (this.atDirectives && !F.directives.docStart)
						this.onError(
							D,
							"MISSING_CHAR",
							"Missing directives-end/doc-start indicator line",
						);
					if ((this.decorate(F, !1), this.doc)) yield this.doc;
					(this.doc = F), (this.atDirectives = !1);
					break;
				}
				case "byte-order-mark":
				case "space":
					break;
				case "comment":
				case "newline":
					this.prelude.push(D.source);
					break;
				case "error": {
					let F = D.source
							? `${D.message}: ${JSON.stringify(D.source)}`
							: D.message,
						_ = new H1.YAMLParseError(K1(D), "UNEXPECTED_TOKEN", F);
					if (this.atDirectives || !this.doc) this.errors.push(_);
					else this.doc.errors.push(_);
					break;
				}
				case "doc-end": {
					if (!this.doc) {
						this.errors.push(
							new H1.YAMLParseError(
								K1(D),
								"UNEXPECTED_TOKEN",
								"Unexpected doc-end without preceding document",
							),
						);
						break;
					}
					this.doc.directives.docEnd = !0;
					let F = RW.resolveEnd(
						D.end,
						D.offset + D.source.length,
						this.doc.options.strict,
						this.onError,
					);
					if ((this.decorate(this.doc, !0), F.comment)) {
						let _ = this.doc.comment;
						this.doc.comment = _
							? `${_}
${F.comment}`
							: F.comment;
					}
					this.doc.range[2] = F.offset;
					break;
				}
				default:
					this.errors.push(
						new H1.YAMLParseError(
							K1(D),
							"UNEXPECTED_TOKEN",
							`Unsupported token ${D.type}`,
						),
					);
			}
		}
		*end(D = !1, F = -1) {
			if (this.doc)
				this.decorate(this.doc, !0), yield this.doc, (this.doc = null);
			else if (D) {
				let _ = Object.assign({ _directives: this.directives }, this.options),
					B = new UW.Document(void 0, _);
				if (this.atDirectives)
					this.onError(
						F,
						"MISSING_CHAR",
						"Missing directives-end indicator line",
					);
				(B.range = [0, F, F]), this.decorate(B, !1), yield B;
			}
		}
	}
	PW.Composer = v_;
});
var f_ = W((xW) => {
	var OW = u6(),
		wW = S6(),
		jW = C1(),
		y_ = B1();
	function uW(D, F = !0, _) {
		if (D) {
			let B = ($, Z, q) => {
				let X = typeof $ === "number" ? $ : Array.isArray($) ? $[0] : $.offset;
				if (_) _(X, Z, q);
				else throw new jW.YAMLParseError([X, X + 1], Z, q);
			};
			switch (D.type) {
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar":
					return wW.resolveFlowScalar(D, F, B);
				case "block-scalar":
					return OW.resolveBlockScalar({ options: { strict: F } }, D, B);
			}
		}
		return null;
	}
	function NW(D, F) {
		let {
				implicitKey: _ = !1,
				indent: B,
				inFlow: $ = !1,
				offset: Z = -1,
				type: q = "PLAIN",
			} = F,
			X = y_.stringifyString(
				{ type: q, value: D },
				{
					implicitKey: _,
					indent: B > 0 ? " ".repeat(B) : "",
					inFlow: $,
					options: { blockQuote: !0, lineWidth: -1 },
				},
			),
			Q = F.end ?? [
				{
					type: "newline",
					offset: -1,
					indent: B,
					source: `
`,
				},
			];
		switch (X[0]) {
			case "|":
			case ">": {
				let J = X.indexOf(`
`),
					z = X.substring(0, J),
					A =
						X.substring(J + 1) +
						`
`,
					L = [
						{ type: "block-scalar-header", offset: Z, indent: B, source: z },
					];
				if (!k_(L, Q))
					L.push({
						type: "newline",
						offset: -1,
						indent: B,
						source: `
`,
					});
				return {
					type: "block-scalar",
					offset: Z,
					indent: B,
					props: L,
					source: A,
				};
			}
			case '"':
				return {
					type: "double-quoted-scalar",
					offset: Z,
					indent: B,
					source: X,
					end: Q,
				};
			case "'":
				return {
					type: "single-quoted-scalar",
					offset: Z,
					indent: B,
					source: X,
					end: Q,
				};
			default:
				return { type: "scalar", offset: Z, indent: B, source: X, end: Q };
		}
	}
	function SW(D, F, _ = {}) {
		let { afterKey: B = !1, implicitKey: $ = !1, inFlow: Z = !1, type: q } = _,
			X = "indent" in D ? D.indent : null;
		if (B && typeof X === "number") X += 2;
		if (!q)
			switch (D.type) {
				case "single-quoted-scalar":
					q = "QUOTE_SINGLE";
					break;
				case "double-quoted-scalar":
					q = "QUOTE_DOUBLE";
					break;
				case "block-scalar": {
					let J = D.props[0];
					if (J.type !== "block-scalar-header")
						throw new Error("Invalid block scalar header");
					q = J.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
					break;
				}
				default:
					q = "PLAIN";
			}
		let Q = y_.stringifyString(
			{ type: q, value: F },
			{
				implicitKey: $ || X === null,
				indent: X !== null && X > 0 ? " ".repeat(X) : "",
				inFlow: Z,
				options: { blockQuote: !0, lineWidth: -1 },
			},
		);
		switch (Q[0]) {
			case "|":
			case ">":
				EW(D, Q);
				break;
			case '"':
				b6(D, Q, "double-quoted-scalar");
				break;
			case "'":
				b6(D, Q, "single-quoted-scalar");
				break;
			default:
				b6(D, Q, "scalar");
		}
	}
	function EW(D, F) {
		let _ = F.indexOf(`
`),
			B = F.substring(0, _),
			$ =
				F.substring(_ + 1) +
				`
`;
		if (D.type === "block-scalar") {
			let Z = D.props[0];
			if (Z.type !== "block-scalar-header")
				throw new Error("Invalid block scalar header");
			(Z.source = B), (D.source = $);
		} else {
			let { offset: Z } = D,
				q = "indent" in D ? D.indent : -1,
				X = [{ type: "block-scalar-header", offset: Z, indent: q, source: B }];
			if (!k_(X, "end" in D ? D.end : void 0))
				X.push({
					type: "newline",
					offset: -1,
					indent: q,
					source: `
`,
				});
			for (let Q of Object.keys(D))
				if (Q !== "type" && Q !== "offset") delete D[Q];
			Object.assign(D, {
				type: "block-scalar",
				indent: q,
				props: X,
				source: $,
			});
		}
	}
	function k_(D, F) {
		if (F)
			for (let _ of F)
				switch (_.type) {
					case "space":
					case "comment":
						D.push(_);
						break;
					case "newline":
						return D.push(_), !0;
				}
		return !1;
	}
	function b6(D, F, _) {
		switch (D.type) {
			case "scalar":
			case "double-quoted-scalar":
			case "single-quoted-scalar":
				(D.type = _), (D.source = F);
				break;
			case "block-scalar": {
				let B = D.props.slice(1),
					$ = F.length;
				if (D.props[0].type === "block-scalar-header")
					$ -= D.props[0].source.length;
				for (let Z of B) Z.offset += $;
				delete D.props, Object.assign(D, { type: _, source: F, end: B });
				break;
			}
			case "block-map":
			case "block-seq": {
				let $ = {
					type: "newline",
					offset: D.offset + F.length,
					indent: D.indent,
					source: `
`,
				};
				delete D.items, Object.assign(D, { type: _, source: F, end: [$] });
				break;
			}
			default: {
				let B = "indent" in D ? D.indent : -1,
					$ =
						"end" in D && Array.isArray(D.end)
							? D.end.filter(
									(Z) =>
										Z.type === "space" ||
										Z.type === "comment" ||
										Z.type === "newline",
								)
							: [];
				for (let Z of Object.keys(D))
					if (Z !== "type" && Z !== "offset") delete D[Z];
				Object.assign(D, { type: _, indent: B, source: F, end: $ });
			}
		}
	}
	xW.createScalarToken = NW;
	xW.resolveAsScalar = uW;
	xW.setScalarValue = SW;
});
var m_ = W((kW) => {
	var yW = (D) => ("type" in D ? cF(D) : dF(D));
	function cF(D) {
		switch (D.type) {
			case "block-scalar": {
				let F = "";
				for (let _ of D.props) F += cF(_);
				return F + D.source;
			}
			case "block-map":
			case "block-seq": {
				let F = "";
				for (let _ of D.items) F += dF(_);
				return F;
			}
			case "flow-collection": {
				let F = D.start.source;
				for (let _ of D.items) F += dF(_);
				for (let _ of D.end) F += _.source;
				return F;
			}
			case "document": {
				let F = dF(D);
				if (D.end) for (let _ of D.end) F += _.source;
				return F;
			}
			default: {
				let F = D.source;
				if ("end" in D && D.end) for (let _ of D.end) F += _.source;
				return F;
			}
		}
	}
	function dF({ start: D, key: F, sep: _, value: B }) {
		let $ = "";
		for (let Z of D) $ += Z.source;
		if (F) $ += cF(F);
		if (_) for (let Z of _) $ += Z.source;
		if (B) $ += cF(B);
		return $;
	}
	kW.stringify = yW;
});
var d_ = W((hW) => {
	var g6 = Symbol("break visit"),
		mW = Symbol("skip children"),
		h_ = Symbol("remove item");
	function sD(D, F) {
		if ("type" in D && D.type === "document")
			D = { start: D.start, value: D.value };
		l_(Object.freeze([]), D, F);
	}
	sD.BREAK = g6;
	sD.SKIP = mW;
	sD.REMOVE = h_;
	sD.itemAtPath = (D, F) => {
		let _ = D;
		for (let [B, $] of F) {
			let Z = _?.[B];
			if (Z && "items" in Z) _ = Z.items[$];
			else return;
		}
		return _;
	};
	sD.parentCollection = (D, F) => {
		let _ = sD.itemAtPath(D, F.slice(0, -1)),
			B = F[F.length - 1][0],
			$ = _?.[B];
		if ($ && "items" in $) return $;
		throw new Error("Parent collection not found");
	};
	function l_(D, F, _) {
		let B = _(F, D);
		if (typeof B === "symbol") return B;
		for (let $ of ["key", "value"]) {
			let Z = F[$];
			if (Z && "items" in Z) {
				for (let q = 0; q < Z.items.length; ++q) {
					let X = l_(Object.freeze(D.concat([[$, q]])), Z.items[q], _);
					if (typeof X === "number") q = X - 1;
					else if (X === g6) return g6;
					else if (X === h_) Z.items.splice(q, 1), (q -= 1);
				}
				if (typeof B === "function" && $ === "key") B = B(F, D);
			}
		}
		return typeof B === "function" ? B(F, D) : B;
	}
	hW.visit = sD;
});
var pF = W((rW) => {
	var v6 = f_(),
		dW = m_(),
		cW = d_(),
		y6 = "\uFEFF",
		k6 = "\x02",
		f6 = "\x18",
		m6 = "\x1F",
		pW = (D) => !!D && "items" in D,
		aW = (D) =>
			!!D &&
			(D.type === "scalar" ||
				D.type === "single-quoted-scalar" ||
				D.type === "double-quoted-scalar" ||
				D.type === "block-scalar");
	function iW(D) {
		switch (D) {
			case y6:
				return "<BOM>";
			case k6:
				return "<DOC>";
			case f6:
				return "<FLOW_END>";
			case m6:
				return "<SCALAR>";
			default:
				return JSON.stringify(D);
		}
	}
	function sW(D) {
		switch (D) {
			case y6:
				return "byte-order-mark";
			case k6:
				return "doc-mode";
			case f6:
				return "flow-error-end";
			case m6:
				return "scalar";
			case "---":
				return "doc-start";
			case "...":
				return "doc-end";
			case "":
			case `
`:
			case `\r
`:
				return "newline";
			case "-":
				return "seq-item-ind";
			case "?":
				return "explicit-key-ind";
			case ":":
				return "map-value-ind";
			case "{":
				return "flow-map-start";
			case "}":
				return "flow-map-end";
			case "[":
				return "flow-seq-start";
			case "]":
				return "flow-seq-end";
			case ",":
				return "comma";
		}
		switch (D[0]) {
			case " ":
			case "\t":
				return "space";
			case "#":
				return "comment";
			case "%":
				return "directive-line";
			case "*":
				return "alias";
			case "&":
				return "anchor";
			case "!":
				return "tag";
			case "'":
				return "single-quoted-scalar";
			case '"':
				return "double-quoted-scalar";
			case "|":
			case ">":
				return "block-scalar-header";
		}
		return null;
	}
	rW.createScalarToken = v6.createScalarToken;
	rW.resolveAsScalar = v6.resolveAsScalar;
	rW.setScalarValue = v6.setScalarValue;
	rW.stringify = dW.stringify;
	rW.visit = cW.visit;
	rW.BOM = y6;
	rW.DOCUMENT = k6;
	rW.FLOW_END = f6;
	rW.SCALAR = m6;
	rW.isCollection = pW;
	rW.isScalar = aW;
	rW.prettyToken = iW;
	rW.tokenType = sW;
});
var l6 = W((AH) => {
	var Y1 = pF();
	function w0(D) {
		switch (D) {
			case void 0:
			case " ":
			case `
`:
			case "\r":
			case "\t":
				return !0;
			default:
				return !1;
		}
	}
	var c_ = new Set("0123456789ABCDEFabcdef"),
		JH = new Set(
			"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()",
		),
		aF = new Set(",[]{}"),
		zH = new Set(` ,[]{}
\r	`),
		h6 = (D) => !D || zH.has(D);
	class p_ {
		constructor() {
			(this.atEnd = !1),
				(this.blockScalarIndent = -1),
				(this.blockScalarKeep = !1),
				(this.buffer = ""),
				(this.flowKey = !1),
				(this.flowLevel = 0),
				(this.indentNext = 0),
				(this.indentValue = 0),
				(this.lineEndPos = null),
				(this.next = null),
				(this.pos = 0);
		}
		*lex(D, F = !1) {
			if (D) {
				if (typeof D !== "string") throw TypeError("source is not a string");
				(this.buffer = this.buffer ? this.buffer + D : D),
					(this.lineEndPos = null);
			}
			this.atEnd = !F;
			let _ = this.next ?? "stream";
			while (_ && (F || this.hasChars(1))) _ = yield* this.parseNext(_);
		}
		atLineEnd() {
			let D = this.pos,
				F = this.buffer[D];
			while (F === " " || F === "\t") F = this.buffer[++D];
			if (
				!F ||
				F === "#" ||
				F ===
					`
`
			)
				return !0;
			if (F === "\r")
				return (
					this.buffer[D + 1] ===
					`
`
				);
			return !1;
		}
		charAt(D) {
			return this.buffer[this.pos + D];
		}
		continueScalar(D) {
			let F = this.buffer[D];
			if (this.indentNext > 0) {
				let _ = 0;
				while (F === " ") F = this.buffer[++_ + D];
				if (F === "\r") {
					let B = this.buffer[_ + D + 1];
					if (
						B ===
							`
` ||
						(!B && !this.atEnd)
					)
						return D + _ + 1;
				}
				return F ===
					`
` ||
					_ >= this.indentNext ||
					(!F && !this.atEnd)
					? D + _
					: -1;
			}
			if (F === "-" || F === ".") {
				let _ = this.buffer.substr(D, 3);
				if ((_ === "---" || _ === "...") && w0(this.buffer[D + 3])) return -1;
			}
			return D;
		}
		getLine() {
			let D = this.lineEndPos;
			if (typeof D !== "number" || (D !== -1 && D < this.pos))
				(D = this.buffer.indexOf(
					`
`,
					this.pos,
				)),
					(this.lineEndPos = D);
			if (D === -1) return this.atEnd ? this.buffer.substring(this.pos) : null;
			if (this.buffer[D - 1] === "\r") D -= 1;
			return this.buffer.substring(this.pos, D);
		}
		hasChars(D) {
			return this.pos + D <= this.buffer.length;
		}
		setNext(D) {
			return (
				(this.buffer = this.buffer.substring(this.pos)),
				(this.pos = 0),
				(this.lineEndPos = null),
				(this.next = D),
				null
			);
		}
		peek(D) {
			return this.buffer.substr(this.pos, D);
		}
		*parseNext(D) {
			switch (D) {
				case "stream":
					return yield* this.parseStream();
				case "line-start":
					return yield* this.parseLineStart();
				case "block-start":
					return yield* this.parseBlockStart();
				case "doc":
					return yield* this.parseDocument();
				case "flow":
					return yield* this.parseFlowCollection();
				case "quoted-scalar":
					return yield* this.parseQuotedScalar();
				case "block-scalar":
					return yield* this.parseBlockScalar();
				case "plain-scalar":
					return yield* this.parsePlainScalar();
			}
		}
		*parseStream() {
			let D = this.getLine();
			if (D === null) return this.setNext("stream");
			if (D[0] === Y1.BOM) yield* this.pushCount(1), (D = D.substring(1));
			if (D[0] === "%") {
				let F = D.length,
					_ = D.indexOf("#");
				while (_ !== -1) {
					let $ = D[_ - 1];
					if ($ === " " || $ === "\t") {
						F = _ - 1;
						break;
					} else _ = D.indexOf("#", _ + 1);
				}
				while (!0) {
					let $ = D[F - 1];
					if ($ === " " || $ === "\t") F -= 1;
					else break;
				}
				let B = (yield* this.pushCount(F)) + (yield* this.pushSpaces(!0));
				return (
					yield* this.pushCount(D.length - B), this.pushNewline(), "stream"
				);
			}
			if (this.atLineEnd()) {
				let F = yield* this.pushSpaces(!0);
				return (
					yield* this.pushCount(D.length - F),
					yield* this.pushNewline(),
					"stream"
				);
			}
			return yield Y1.DOCUMENT, yield* this.parseLineStart();
		}
		*parseLineStart() {
			let D = this.charAt(0);
			if (!D && !this.atEnd) return this.setNext("line-start");
			if (D === "-" || D === ".") {
				if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
				let F = this.peek(3);
				if ((F === "---" || F === "...") && w0(this.charAt(3)))
					return (
						yield* this.pushCount(3),
						(this.indentValue = 0),
						(this.indentNext = 0),
						F === "---" ? "doc" : "stream"
					);
			}
			if (
				((this.indentValue = yield* this.pushSpaces(!1)),
				this.indentNext > this.indentValue && !w0(this.charAt(1)))
			)
				this.indentNext = this.indentValue;
			return yield* this.parseBlockStart();
		}
		*parseBlockStart() {
			let [D, F] = this.peek(2);
			if (!F && !this.atEnd) return this.setNext("block-start");
			if ((D === "-" || D === "?" || D === ":") && w0(F)) {
				let _ = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
				return (
					(this.indentNext = this.indentValue + 1),
					(this.indentValue += _),
					yield* this.parseBlockStart()
				);
			}
			return "doc";
		}
		*parseDocument() {
			yield* this.pushSpaces(!0);
			let D = this.getLine();
			if (D === null) return this.setNext("doc");
			let F = yield* this.pushIndicators();
			switch (D[F]) {
				case "#":
					yield* this.pushCount(D.length - F);
				case void 0:
					return yield* this.pushNewline(), yield* this.parseLineStart();
				case "{":
				case "[":
					return (
						yield* this.pushCount(1),
						(this.flowKey = !1),
						(this.flowLevel = 1),
						"flow"
					);
				case "}":
				case "]":
					return yield* this.pushCount(1), "doc";
				case "*":
					return yield* this.pushUntil(h6), "doc";
				case '"':
				case "'":
					return yield* this.parseQuotedScalar();
				case "|":
				case ">":
					return (
						(F += yield* this.parseBlockScalarHeader()),
						(F += yield* this.pushSpaces(!0)),
						yield* this.pushCount(D.length - F),
						yield* this.pushNewline(),
						yield* this.parseBlockScalar()
					);
				default:
					return yield* this.parsePlainScalar();
			}
		}
		*parseFlowCollection() {
			let D,
				F,
				_ = -1;
			do {
				if (((D = yield* this.pushNewline()), D > 0))
					(F = yield* this.pushSpaces(!1)), (this.indentValue = _ = F);
				else F = 0;
				F += yield* this.pushSpaces(!0);
			} while (D + F > 0);
			let B = this.getLine();
			if (B === null) return this.setNext("flow");
			if (
				(_ !== -1 && _ < this.indentNext && B[0] !== "#") ||
				(_ === 0 && (B.startsWith("---") || B.startsWith("...")) && w0(B[3]))
			) {
				if (
					!(
						_ === this.indentNext - 1 &&
						this.flowLevel === 1 &&
						(B[0] === "]" || B[0] === "}")
					)
				)
					return (
						(this.flowLevel = 0),
						yield Y1.FLOW_END,
						yield* this.parseLineStart()
					);
			}
			let $ = 0;
			while (B[$] === ",")
				($ += yield* this.pushCount(1)),
					($ += yield* this.pushSpaces(!0)),
					(this.flowKey = !1);
			switch ((($ += yield* this.pushIndicators()), B[$])) {
				case void 0:
					return "flow";
				case "#":
					return yield* this.pushCount(B.length - $), "flow";
				case "{":
				case "[":
					return (
						yield* this.pushCount(1),
						(this.flowKey = !1),
						(this.flowLevel += 1),
						"flow"
					);
				case "}":
				case "]":
					return (
						yield* this.pushCount(1),
						(this.flowKey = !0),
						(this.flowLevel -= 1),
						this.flowLevel ? "flow" : "doc"
					);
				case "*":
					return yield* this.pushUntil(h6), "flow";
				case '"':
				case "'":
					return (this.flowKey = !0), yield* this.parseQuotedScalar();
				case ":": {
					let Z = this.charAt(1);
					if (this.flowKey || w0(Z) || Z === ",")
						return (
							(this.flowKey = !1),
							yield* this.pushCount(1),
							yield* this.pushSpaces(!0),
							"flow"
						);
				}
				default:
					return (this.flowKey = !1), yield* this.parsePlainScalar();
			}
		}
		*parseQuotedScalar() {
			let D = this.charAt(0),
				F = this.buffer.indexOf(D, this.pos + 1);
			if (D === "'")
				while (F !== -1 && this.buffer[F + 1] === "'")
					F = this.buffer.indexOf("'", F + 2);
			else
				while (F !== -1) {
					let $ = 0;
					while (this.buffer[F - 1 - $] === "\\") $ += 1;
					if ($ % 2 === 0) break;
					F = this.buffer.indexOf('"', F + 1);
				}
			let _ = this.buffer.substring(0, F),
				B = _.indexOf(
					`
`,
					this.pos,
				);
			if (B !== -1) {
				while (B !== -1) {
					let $ = this.continueScalar(B + 1);
					if ($ === -1) break;
					B = _.indexOf(
						`
`,
						$,
					);
				}
				if (B !== -1) F = B - (_[B - 1] === "\r" ? 2 : 1);
			}
			if (F === -1) {
				if (!this.atEnd) return this.setNext("quoted-scalar");
				F = this.buffer.length;
			}
			return (
				yield* this.pushToIndex(F + 1, !1), this.flowLevel ? "flow" : "doc"
			);
		}
		*parseBlockScalarHeader() {
			(this.blockScalarIndent = -1), (this.blockScalarKeep = !1);
			let D = this.pos;
			while (!0) {
				let F = this.buffer[++D];
				if (F === "+") this.blockScalarKeep = !0;
				else if (F > "0" && F <= "9") this.blockScalarIndent = Number(F) - 1;
				else if (F !== "-") break;
			}
			return yield* this.pushUntil((F) => w0(F) || F === "#");
		}
		*parseBlockScalar() {
			let D = this.pos - 1,
				F = 0,
				_;
			D: for (let $ = this.pos; (_ = this.buffer[$]); ++$)
				switch (_) {
					case " ":
						F += 1;
						break;
					case `
`:
						(D = $), (F = 0);
						break;
					case "\r": {
						let Z = this.buffer[$ + 1];
						if (!Z && !this.atEnd) return this.setNext("block-scalar");
						if (
							Z ===
							`
`
						)
							break;
					}
					default:
						break D;
				}
			if (!_ && !this.atEnd) return this.setNext("block-scalar");
			if (F >= this.indentNext) {
				if (this.blockScalarIndent === -1) this.indentNext = F;
				else
					this.indentNext =
						this.blockScalarIndent +
						(this.indentNext === 0 ? 1 : this.indentNext);
				do {
					let $ = this.continueScalar(D + 1);
					if ($ === -1) break;
					D = this.buffer.indexOf(
						`
`,
						$,
					);
				} while (D !== -1);
				if (D === -1) {
					if (!this.atEnd) return this.setNext("block-scalar");
					D = this.buffer.length;
				}
			}
			let B = D + 1;
			_ = this.buffer[B];
			while (_ === " ") _ = this.buffer[++B];
			if (_ === "\t") {
				while (
					_ === "\t" ||
					_ === " " ||
					_ === "\r" ||
					_ ===
						`
`
				)
					_ = this.buffer[++B];
				D = B - 1;
			} else if (!this.blockScalarKeep)
				do {
					let $ = D - 1,
						Z = this.buffer[$];
					if (Z === "\r") Z = this.buffer[--$];
					let q = $;
					while (Z === " ") Z = this.buffer[--$];
					if (
						Z ===
							`
` &&
						$ >= this.pos &&
						$ + 1 + F > q
					)
						D = $;
					else break;
				} while (!0);
			return (
				yield Y1.SCALAR,
				yield* this.pushToIndex(D + 1, !0),
				yield* this.parseLineStart()
			);
		}
		*parsePlainScalar() {
			let D = this.flowLevel > 0,
				F = this.pos - 1,
				_ = this.pos - 1,
				B;
			while ((B = this.buffer[++_]))
				if (B === ":") {
					let $ = this.buffer[_ + 1];
					if (w0($) || (D && aF.has($))) break;
					F = _;
				} else if (w0(B)) {
					let $ = this.buffer[_ + 1];
					if (B === "\r")
						if (
							$ ===
							`
`
						)
							(_ += 1),
								(B = `
`),
								($ = this.buffer[_ + 1]);
						else F = _;
					if ($ === "#" || (D && aF.has($))) break;
					if (
						B ===
						`
`
					) {
						let Z = this.continueScalar(_ + 1);
						if (Z === -1) break;
						_ = Math.max(_, Z - 2);
					}
				} else {
					if (D && aF.has(B)) break;
					F = _;
				}
			if (!B && !this.atEnd) return this.setNext("plain-scalar");
			return (
				yield Y1.SCALAR, yield* this.pushToIndex(F + 1, !0), D ? "flow" : "doc"
			);
		}
		*pushCount(D) {
			if (D > 0)
				return yield this.buffer.substr(this.pos, D), (this.pos += D), D;
			return 0;
		}
		*pushToIndex(D, F) {
			let _ = this.buffer.slice(this.pos, D);
			if (_) return yield _, (this.pos += _.length), _.length;
			else if (F) yield "";
			return 0;
		}
		*pushIndicators() {
			switch (this.charAt(0)) {
				case "!":
					return (
						(yield* this.pushTag()) +
						(yield* this.pushSpaces(!0)) +
						(yield* this.pushIndicators())
					);
				case "&":
					return (
						(yield* this.pushUntil(h6)) +
						(yield* this.pushSpaces(!0)) +
						(yield* this.pushIndicators())
					);
				case "-":
				case "?":
				case ":": {
					let D = this.flowLevel > 0,
						F = this.charAt(1);
					if (w0(F) || (D && aF.has(F))) {
						if (!D) this.indentNext = this.indentValue + 1;
						else if (this.flowKey) this.flowKey = !1;
						return (
							(yield* this.pushCount(1)) +
							(yield* this.pushSpaces(!0)) +
							(yield* this.pushIndicators())
						);
					}
				}
			}
			return 0;
		}
		*pushTag() {
			if (this.charAt(1) === "<") {
				let D = this.pos + 2,
					F = this.buffer[D];
				while (!w0(F) && F !== ">") F = this.buffer[++D];
				return yield* this.pushToIndex(F === ">" ? D + 1 : D, !1);
			} else {
				let D = this.pos + 1,
					F = this.buffer[D];
				while (F)
					if (JH.has(F)) F = this.buffer[++D];
					else if (
						F === "%" &&
						c_.has(this.buffer[D + 1]) &&
						c_.has(this.buffer[D + 2])
					)
						F = this.buffer[(D += 3)];
					else break;
				return yield* this.pushToIndex(D, !1);
			}
		}
		*pushNewline() {
			let D = this.buffer[this.pos];
			if (
				D ===
				`
`
			)
				return yield* this.pushCount(1);
			else if (
				D === "\r" &&
				this.charAt(1) ===
					`
`
			)
				return yield* this.pushCount(2);
			else return 0;
		}
		*pushSpaces(D) {
			let F = this.pos - 1,
				_;
			do _ = this.buffer[++F];
			while (_ === " " || (D && _ === "\t"));
			let B = F - this.pos;
			if (B > 0) yield this.buffer.substr(this.pos, B), (this.pos = F);
			return B;
		}
		*pushUntil(D) {
			let F = this.pos,
				_ = this.buffer[F];
			while (!D(_)) _ = this.buffer[++F];
			return yield* this.pushToIndex(F, !1);
		}
	}
	AH.Lexer = p_;
});
var d6 = W((GH) => {
	class a_ {
		constructor() {
			(this.lineStarts = []),
				(this.addNewLine = (D) => this.lineStarts.push(D)),
				(this.linePos = (D) => {
					let F = 0,
						_ = this.lineStarts.length;
					while (F < _) {
						let $ = (F + _) >> 1;
						if (this.lineStarts[$] < D) F = $ + 1;
						else _ = $;
					}
					if (this.lineStarts[F] === D) return { line: F + 1, col: 1 };
					if (F === 0) return { line: 0, col: D };
					let B = this.lineStarts[F - 1];
					return { line: F, col: D - B + 1 };
				});
		}
	}
	GH.LineCounter = a_;
});
var c6 = W((HH) => {
	var CH = R("process"),
		i_ = pF(),
		WH = l6();
	function rD(D, F) {
		for (let _ = 0; _ < D.length; ++_) if (D[_].type === F) return !0;
		return !1;
	}
	function s_(D) {
		for (let F = 0; F < D.length; ++F)
			switch (D[F].type) {
				case "space":
				case "comment":
				case "newline":
					break;
				default:
					return F;
			}
		return -1;
	}
	function n_(D) {
		switch (D?.type) {
			case "alias":
			case "scalar":
			case "single-quoted-scalar":
			case "double-quoted-scalar":
			case "flow-collection":
				return !0;
			default:
				return !1;
		}
	}
	function iF(D) {
		switch (D.type) {
			case "document":
				return D.start;
			case "block-map": {
				let F = D.items[D.items.length - 1];
				return F.sep ?? F.start;
			}
			case "block-seq":
				return D.items[D.items.length - 1].start;
			default:
				return [];
		}
	}
	function Y2(D) {
		if (D.length === 0) return [];
		let F = D.length;
		D: while (--F >= 0)
			switch (D[F].type) {
				case "doc-start":
				case "explicit-key-ind":
				case "map-value-ind":
				case "seq-item-ind":
				case "newline":
					break D;
			}
		while (D[++F]?.type === "space");
		return D.splice(F, D.length);
	}
	function r_(D) {
		if (D.start.type === "flow-seq-start") {
			for (let F of D.items)
				if (
					F.sep &&
					!F.value &&
					!rD(F.start, "explicit-key-ind") &&
					!rD(F.sep, "map-value-ind")
				) {
					if (F.key) F.value = F.key;
					if ((delete F.key, n_(F.value)))
						if (F.value.end) Array.prototype.push.apply(F.value.end, F.sep);
						else F.value.end = F.sep;
					else Array.prototype.push.apply(F.start, F.sep);
					delete F.sep;
				}
		}
	}
	class o_ {
		constructor(D) {
			(this.atNewLine = !0),
				(this.atScalar = !1),
				(this.indent = 0),
				(this.offset = 0),
				(this.onKeyLine = !1),
				(this.stack = []),
				(this.source = ""),
				(this.type = ""),
				(this.lexer = new WH.Lexer()),
				(this.onNewLine = D);
		}
		*parse(D, F = !1) {
			if (this.onNewLine && this.offset === 0) this.onNewLine(0);
			for (let _ of this.lexer.lex(D, F)) yield* this.next(_);
			if (!F) yield* this.end();
		}
		*next(D) {
			if (((this.source = D), CH.env.LOG_TOKENS))
				console.log("|", i_.prettyToken(D));
			if (this.atScalar) {
				(this.atScalar = !1), yield* this.step(), (this.offset += D.length);
				return;
			}
			let F = i_.tokenType(D);
			if (!F) {
				let _ = `Not a YAML token: ${D}`;
				yield* this.pop({
					type: "error",
					offset: this.offset,
					message: _,
					source: D,
				}),
					(this.offset += D.length);
			} else if (F === "scalar")
				(this.atNewLine = !1), (this.atScalar = !0), (this.type = "scalar");
			else {
				switch (((this.type = F), yield* this.step(), F)) {
					case "newline":
						if (((this.atNewLine = !0), (this.indent = 0), this.onNewLine))
							this.onNewLine(this.offset + D.length);
						break;
					case "space":
						if (this.atNewLine && D[0] === " ") this.indent += D.length;
						break;
					case "explicit-key-ind":
					case "map-value-ind":
					case "seq-item-ind":
						if (this.atNewLine) this.indent += D.length;
						break;
					case "doc-mode":
					case "flow-error-end":
						return;
					default:
						this.atNewLine = !1;
				}
				this.offset += D.length;
			}
		}
		*end() {
			while (this.stack.length > 0) yield* this.pop();
		}
		get sourceToken() {
			return {
				type: this.type,
				offset: this.offset,
				indent: this.indent,
				source: this.source,
			};
		}
		*step() {
			let D = this.peek(1);
			if (this.type === "doc-end" && (!D || D.type !== "doc-end")) {
				while (this.stack.length > 0) yield* this.pop();
				this.stack.push({
					type: "doc-end",
					offset: this.offset,
					source: this.source,
				});
				return;
			}
			if (!D) return yield* this.stream();
			switch (D.type) {
				case "document":
					return yield* this.document(D);
				case "alias":
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar":
					return yield* this.scalar(D);
				case "block-scalar":
					return yield* this.blockScalar(D);
				case "block-map":
					return yield* this.blockMap(D);
				case "block-seq":
					return yield* this.blockSequence(D);
				case "flow-collection":
					return yield* this.flowCollection(D);
				case "doc-end":
					return yield* this.documentEnd(D);
			}
			yield* this.pop();
		}
		peek(D) {
			return this.stack[this.stack.length - D];
		}
		*pop(D) {
			let F = D ?? this.stack.pop();
			if (!F)
				yield {
					type: "error",
					offset: this.offset,
					source: "",
					message: "Tried to pop an empty stack",
				};
			else if (this.stack.length === 0) yield F;
			else {
				let _ = this.peek(1);
				if (F.type === "block-scalar") F.indent = "indent" in _ ? _.indent : 0;
				else if (F.type === "flow-collection" && _.type === "document")
					F.indent = 0;
				if (F.type === "flow-collection") r_(F);
				switch (_.type) {
					case "document":
						_.value = F;
						break;
					case "block-scalar":
						_.props.push(F);
						break;
					case "block-map": {
						let B = _.items[_.items.length - 1];
						if (B.value) {
							_.items.push({ start: [], key: F, sep: [] }),
								(this.onKeyLine = !0);
							return;
						} else if (B.sep) B.value = F;
						else {
							Object.assign(B, { key: F, sep: [] }),
								(this.onKeyLine = !B.explicitKey);
							return;
						}
						break;
					}
					case "block-seq": {
						let B = _.items[_.items.length - 1];
						if (B.value) _.items.push({ start: [], value: F });
						else B.value = F;
						break;
					}
					case "flow-collection": {
						let B = _.items[_.items.length - 1];
						if (!B || B.value) _.items.push({ start: [], key: F, sep: [] });
						else if (B.sep) B.value = F;
						else Object.assign(B, { key: F, sep: [] });
						return;
					}
					default:
						yield* this.pop(), yield* this.pop(F);
				}
				if (
					(_.type === "document" ||
						_.type === "block-map" ||
						_.type === "block-seq") &&
					(F.type === "block-map" || F.type === "block-seq")
				) {
					let B = F.items[F.items.length - 1];
					if (
						B &&
						!B.sep &&
						!B.value &&
						B.start.length > 0 &&
						s_(B.start) === -1 &&
						(F.indent === 0 ||
							B.start.every(($) => $.type !== "comment" || $.indent < F.indent))
					) {
						if (_.type === "document") _.end = B.start;
						else _.items.push({ start: B.start });
						F.items.splice(-1, 1);
					}
				}
			}
		}
		*stream() {
			switch (this.type) {
				case "directive-line":
					yield { type: "directive", offset: this.offset, source: this.source };
					return;
				case "byte-order-mark":
				case "space":
				case "comment":
				case "newline":
					yield this.sourceToken;
					return;
				case "doc-mode":
				case "doc-start": {
					let D = { type: "document", offset: this.offset, start: [] };
					if (this.type === "doc-start") D.start.push(this.sourceToken);
					this.stack.push(D);
					return;
				}
			}
			yield {
				type: "error",
				offset: this.offset,
				message: `Unexpected ${this.type} token in YAML stream`,
				source: this.source,
			};
		}
		*document(D) {
			if (D.value) return yield* this.lineEnd(D);
			switch (this.type) {
				case "doc-start": {
					if (s_(D.start) !== -1) yield* this.pop(), yield* this.step();
					else D.start.push(this.sourceToken);
					return;
				}
				case "anchor":
				case "tag":
				case "space":
				case "comment":
				case "newline":
					D.start.push(this.sourceToken);
					return;
			}
			let F = this.startBlockValue(D);
			if (F) this.stack.push(F);
			else
				yield {
					type: "error",
					offset: this.offset,
					message: `Unexpected ${this.type} token in YAML document`,
					source: this.source,
				};
		}
		*scalar(D) {
			if (this.type === "map-value-ind") {
				let F = iF(this.peek(2)),
					_ = Y2(F),
					B;
				if (D.end) (B = D.end), B.push(this.sourceToken), delete D.end;
				else B = [this.sourceToken];
				let $ = {
					type: "block-map",
					offset: D.offset,
					indent: D.indent,
					items: [{ start: _, key: D, sep: B }],
				};
				(this.onKeyLine = !0), (this.stack[this.stack.length - 1] = $);
			} else yield* this.lineEnd(D);
		}
		*blockScalar(D) {
			switch (this.type) {
				case "space":
				case "comment":
				case "newline":
					D.props.push(this.sourceToken);
					return;
				case "scalar":
					if (
						((D.source = this.source),
						(this.atNewLine = !0),
						(this.indent = 0),
						this.onNewLine)
					) {
						let F =
							this.source.indexOf(`
`) + 1;
						while (F !== 0)
							this.onNewLine(this.offset + F),
								(F =
									this.source.indexOf(
										`
`,
										F,
									) + 1);
					}
					yield* this.pop();
					break;
				default:
					yield* this.pop(), yield* this.step();
			}
		}
		*blockMap(D) {
			let F = D.items[D.items.length - 1];
			switch (this.type) {
				case "newline":
					if (((this.onKeyLine = !1), F.value)) {
						let _ = "end" in F.value ? F.value.end : void 0;
						if (
							(Array.isArray(_) ? _[_.length - 1] : void 0)?.type === "comment"
						)
							_?.push(this.sourceToken);
						else D.items.push({ start: [this.sourceToken] });
					} else if (F.sep) F.sep.push(this.sourceToken);
					else F.start.push(this.sourceToken);
					return;
				case "space":
				case "comment":
					if (F.value) D.items.push({ start: [this.sourceToken] });
					else if (F.sep) F.sep.push(this.sourceToken);
					else {
						if (this.atIndentedComment(F.start, D.indent)) {
							let B = D.items[D.items.length - 2]?.value?.end;
							if (Array.isArray(B)) {
								Array.prototype.push.apply(B, F.start),
									B.push(this.sourceToken),
									D.items.pop();
								return;
							}
						}
						F.start.push(this.sourceToken);
					}
					return;
			}
			if (this.indent >= D.indent) {
				let _ = !this.onKeyLine && this.indent === D.indent,
					B = _ && (F.sep || F.explicitKey) && this.type !== "seq-item-ind",
					$ = [];
				if (B && F.sep && !F.value) {
					let Z = [];
					for (let q = 0; q < F.sep.length; ++q) {
						let X = F.sep[q];
						switch (X.type) {
							case "newline":
								Z.push(q);
								break;
							case "space":
								break;
							case "comment":
								if (X.indent > D.indent) Z.length = 0;
								break;
							default:
								Z.length = 0;
						}
					}
					if (Z.length >= 2) $ = F.sep.splice(Z[1]);
				}
				switch (this.type) {
					case "anchor":
					case "tag":
						if (B || F.value)
							$.push(this.sourceToken),
								D.items.push({ start: $ }),
								(this.onKeyLine = !0);
						else if (F.sep) F.sep.push(this.sourceToken);
						else F.start.push(this.sourceToken);
						return;
					case "explicit-key-ind":
						if (!F.sep && !F.explicitKey)
							F.start.push(this.sourceToken), (F.explicitKey = !0);
						else if (B || F.value)
							$.push(this.sourceToken),
								D.items.push({ start: $, explicitKey: !0 });
						else
							this.stack.push({
								type: "block-map",
								offset: this.offset,
								indent: this.indent,
								items: [{ start: [this.sourceToken], explicitKey: !0 }],
							});
						this.onKeyLine = !0;
						return;
					case "map-value-ind":
						if (F.explicitKey)
							if (!F.sep)
								if (rD(F.start, "newline"))
									Object.assign(F, { key: null, sep: [this.sourceToken] });
								else {
									let Z = Y2(F.start);
									this.stack.push({
										type: "block-map",
										offset: this.offset,
										indent: this.indent,
										items: [{ start: Z, key: null, sep: [this.sourceToken] }],
									});
								}
							else if (F.value)
								D.items.push({ start: [], key: null, sep: [this.sourceToken] });
							else if (rD(F.sep, "map-value-ind"))
								this.stack.push({
									type: "block-map",
									offset: this.offset,
									indent: this.indent,
									items: [{ start: $, key: null, sep: [this.sourceToken] }],
								});
							else if (n_(F.key) && !rD(F.sep, "newline")) {
								let Z = Y2(F.start),
									q = F.key,
									X = F.sep;
								X.push(this.sourceToken),
									delete F.key,
									delete F.sep,
									this.stack.push({
										type: "block-map",
										offset: this.offset,
										indent: this.indent,
										items: [{ start: Z, key: q, sep: X }],
									});
							} else if ($.length > 0)
								F.sep = F.sep.concat($, this.sourceToken);
							else F.sep.push(this.sourceToken);
						else if (!F.sep)
							Object.assign(F, { key: null, sep: [this.sourceToken] });
						else if (F.value || B)
							D.items.push({ start: $, key: null, sep: [this.sourceToken] });
						else if (rD(F.sep, "map-value-ind"))
							this.stack.push({
								type: "block-map",
								offset: this.offset,
								indent: this.indent,
								items: [{ start: [], key: null, sep: [this.sourceToken] }],
							});
						else F.sep.push(this.sourceToken);
						this.onKeyLine = !0;
						return;
					case "alias":
					case "scalar":
					case "single-quoted-scalar":
					case "double-quoted-scalar": {
						let Z = this.flowScalar(this.type);
						if (B || F.value)
							D.items.push({ start: $, key: Z, sep: [] }),
								(this.onKeyLine = !0);
						else if (F.sep) this.stack.push(Z);
						else Object.assign(F, { key: Z, sep: [] }), (this.onKeyLine = !0);
						return;
					}
					default: {
						let Z = this.startBlockValue(D);
						if (Z) {
							if (_ && Z.type !== "block-seq") D.items.push({ start: $ });
							this.stack.push(Z);
							return;
						}
					}
				}
			}
			yield* this.pop(), yield* this.step();
		}
		*blockSequence(D) {
			let F = D.items[D.items.length - 1];
			switch (this.type) {
				case "newline":
					if (F.value) {
						let _ = "end" in F.value ? F.value.end : void 0;
						if (
							(Array.isArray(_) ? _[_.length - 1] : void 0)?.type === "comment"
						)
							_?.push(this.sourceToken);
						else D.items.push({ start: [this.sourceToken] });
					} else F.start.push(this.sourceToken);
					return;
				case "space":
				case "comment":
					if (F.value) D.items.push({ start: [this.sourceToken] });
					else {
						if (this.atIndentedComment(F.start, D.indent)) {
							let B = D.items[D.items.length - 2]?.value?.end;
							if (Array.isArray(B)) {
								Array.prototype.push.apply(B, F.start),
									B.push(this.sourceToken),
									D.items.pop();
								return;
							}
						}
						F.start.push(this.sourceToken);
					}
					return;
				case "anchor":
				case "tag":
					if (F.value || this.indent <= D.indent) break;
					F.start.push(this.sourceToken);
					return;
				case "seq-item-ind":
					if (this.indent !== D.indent) break;
					if (F.value || rD(F.start, "seq-item-ind"))
						D.items.push({ start: [this.sourceToken] });
					else F.start.push(this.sourceToken);
					return;
			}
			if (this.indent > D.indent) {
				let _ = this.startBlockValue(D);
				if (_) {
					this.stack.push(_);
					return;
				}
			}
			yield* this.pop(), yield* this.step();
		}
		*flowCollection(D) {
			let F = D.items[D.items.length - 1];
			if (this.type === "flow-error-end") {
				let _;
				do yield* this.pop(), (_ = this.peek(1));
				while (_ && _.type === "flow-collection");
			} else if (D.end.length === 0) {
				switch (this.type) {
					case "comma":
					case "explicit-key-ind":
						if (!F || F.sep) D.items.push({ start: [this.sourceToken] });
						else F.start.push(this.sourceToken);
						return;
					case "map-value-ind":
						if (!F || F.value)
							D.items.push({ start: [], key: null, sep: [this.sourceToken] });
						else if (F.sep) F.sep.push(this.sourceToken);
						else Object.assign(F, { key: null, sep: [this.sourceToken] });
						return;
					case "space":
					case "comment":
					case "newline":
					case "anchor":
					case "tag":
						if (!F || F.value) D.items.push({ start: [this.sourceToken] });
						else if (F.sep) F.sep.push(this.sourceToken);
						else F.start.push(this.sourceToken);
						return;
					case "alias":
					case "scalar":
					case "single-quoted-scalar":
					case "double-quoted-scalar": {
						let B = this.flowScalar(this.type);
						if (!F || F.value) D.items.push({ start: [], key: B, sep: [] });
						else if (F.sep) this.stack.push(B);
						else Object.assign(F, { key: B, sep: [] });
						return;
					}
					case "flow-map-end":
					case "flow-seq-end":
						D.end.push(this.sourceToken);
						return;
				}
				let _ = this.startBlockValue(D);
				if (_) this.stack.push(_);
				else yield* this.pop(), yield* this.step();
			} else {
				let _ = this.peek(2);
				if (
					_.type === "block-map" &&
					((this.type === "map-value-ind" && _.indent === D.indent) ||
						(this.type === "newline" && !_.items[_.items.length - 1].sep))
				)
					yield* this.pop(), yield* this.step();
				else if (
					this.type === "map-value-ind" &&
					_.type !== "flow-collection"
				) {
					let B = iF(_),
						$ = Y2(B);
					r_(D);
					let Z = D.end.splice(1, D.end.length);
					Z.push(this.sourceToken);
					let q = {
						type: "block-map",
						offset: D.offset,
						indent: D.indent,
						items: [{ start: $, key: D, sep: Z }],
					};
					(this.onKeyLine = !0), (this.stack[this.stack.length - 1] = q);
				} else yield* this.lineEnd(D);
			}
		}
		flowScalar(D) {
			if (this.onNewLine) {
				let F =
					this.source.indexOf(`
`) + 1;
				while (F !== 0)
					this.onNewLine(this.offset + F),
						(F =
							this.source.indexOf(
								`
`,
								F,
							) + 1);
			}
			return {
				type: D,
				offset: this.offset,
				indent: this.indent,
				source: this.source,
			};
		}
		startBlockValue(D) {
			switch (this.type) {
				case "alias":
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar":
					return this.flowScalar(this.type);
				case "block-scalar-header":
					return {
						type: "block-scalar",
						offset: this.offset,
						indent: this.indent,
						props: [this.sourceToken],
						source: "",
					};
				case "flow-map-start":
				case "flow-seq-start":
					return {
						type: "flow-collection",
						offset: this.offset,
						indent: this.indent,
						start: this.sourceToken,
						items: [],
						end: [],
					};
				case "seq-item-ind":
					return {
						type: "block-seq",
						offset: this.offset,
						indent: this.indent,
						items: [{ start: [this.sourceToken] }],
					};
				case "explicit-key-ind": {
					this.onKeyLine = !0;
					let F = iF(D),
						_ = Y2(F);
					return (
						_.push(this.sourceToken),
						{
							type: "block-map",
							offset: this.offset,
							indent: this.indent,
							items: [{ start: _, explicitKey: !0 }],
						}
					);
				}
				case "map-value-ind": {
					this.onKeyLine = !0;
					let F = iF(D),
						_ = Y2(F);
					return {
						type: "block-map",
						offset: this.offset,
						indent: this.indent,
						items: [{ start: _, key: null, sep: [this.sourceToken] }],
					};
				}
			}
			return null;
		}
		atIndentedComment(D, F) {
			if (this.type !== "comment") return !1;
			if (this.indent <= F) return !1;
			return D.every((_) => _.type === "newline" || _.type === "space");
		}
		*documentEnd(D) {
			if (this.type !== "doc-mode") {
				if (D.end) D.end.push(this.sourceToken);
				else D.end = [this.sourceToken];
				if (this.type === "newline") yield* this.pop();
			}
		}
		*lineEnd(D) {
			switch (this.type) {
				case "comma":
				case "doc-start":
				case "doc-end":
				case "flow-seq-end":
				case "flow-map-end":
				case "map-value-ind":
					yield* this.pop(), yield* this.step();
					break;
				case "newline":
					this.onKeyLine = !1;
				case "space":
				case "comment":
				default:
					if (D.end) D.end.push(this.sourceToken);
					else D.end = [this.sourceToken];
					if (this.type === "newline") yield* this.pop();
			}
		}
	}
	HH.Parser = o_;
});
var _B = W((OH) => {
	var t_ = x6(),
		YH = V1(),
		I1 = C1(),
		IH = d8(),
		UH = j(),
		MH = d6(),
		e_ = c6();
	function DB(D) {
		let F = D.prettyErrors !== !1;
		return {
			lineCounter: D.lineCounter || (F && new MH.LineCounter()) || null,
			prettyErrors: F,
		};
	}
	function RH(D, F = {}) {
		let { lineCounter: _, prettyErrors: B } = DB(F),
			$ = new e_.Parser(_?.addNewLine),
			Z = new t_.Composer(F),
			q = Array.from(Z.compose($.parse(D)));
		if (B && _)
			for (let X of q)
				X.errors.forEach(I1.prettifyError(D, _)),
					X.warnings.forEach(I1.prettifyError(D, _));
		if (q.length > 0) return q;
		return Object.assign([], { empty: !0 }, Z.streamInfo());
	}
	function FB(D, F = {}) {
		let { lineCounter: _, prettyErrors: B } = DB(F),
			$ = new e_.Parser(_?.addNewLine),
			Z = new t_.Composer(F),
			q = null;
		for (let X of Z.compose($.parse(D), !0, D.length))
			if (!q) q = X;
			else if (q.options.logLevel !== "silent") {
				q.errors.push(
					new I1.YAMLParseError(
						X.range.slice(0, 2),
						"MULTIPLE_DOCS",
						"Source contains multiple documents; please use YAML.parseAllDocuments()",
					),
				);
				break;
			}
		if (B && _)
			q.errors.forEach(I1.prettifyError(D, _)),
				q.warnings.forEach(I1.prettifyError(D, _));
		return q;
	}
	function PH(D, F, _) {
		let B = void 0;
		if (typeof F === "function") B = F;
		else if (_ === void 0 && F && typeof F === "object") _ = F;
		let $ = FB(D, _);
		if (!$) return null;
		if (
			($.warnings.forEach((Z) => IH.warn($.options.logLevel, Z)),
			$.errors.length > 0)
		)
			if ($.options.logLevel !== "silent") throw $.errors[0];
			else $.errors = [];
		return $.toJS(Object.assign({ reviver: B }, _));
	}
	function TH(D, F, _) {
		let B = null;
		if (typeof F === "function" || Array.isArray(F)) B = F;
		else if (_ === void 0 && F) _ = F;
		if (typeof _ === "string") _ = _.length;
		if (typeof _ === "number") {
			let $ = Math.round(_);
			_ = $ < 1 ? void 0 : $ > 8 ? { indent: 8 } : { indent: $ };
		}
		if (D === void 0) {
			let { keepUndefined: $ } = _ ?? F ?? {};
			if (!$) return;
		}
		if (UH.isDocument(D) && !B) return D.toString(_);
		return new YH.Document(D, B, _).toString(_);
	}
	OH.parse = PH;
	OH.parseAllDocuments = RH;
	OH.parseDocument = FB;
	OH.stringify = TH;
});
var $B = W((dH) => {
	var SH = x6(),
		EH = V1(),
		xH = H6(),
		p6 = C1(),
		bH = e2(),
		PD = j(),
		gH = ID(),
		vH = p(),
		yH = MD(),
		kH = RD(),
		fH = pF(),
		mH = l6(),
		hH = d6(),
		lH = c6(),
		sF = _B(),
		BB = o2();
	dH.Composer = SH.Composer;
	dH.Document = EH.Document;
	dH.Schema = xH.Schema;
	dH.YAMLError = p6.YAMLError;
	dH.YAMLParseError = p6.YAMLParseError;
	dH.YAMLWarning = p6.YAMLWarning;
	dH.Alias = bH.Alias;
	dH.isAlias = PD.isAlias;
	dH.isCollection = PD.isCollection;
	dH.isDocument = PD.isDocument;
	dH.isMap = PD.isMap;
	dH.isNode = PD.isNode;
	dH.isPair = PD.isPair;
	dH.isScalar = PD.isScalar;
	dH.isSeq = PD.isSeq;
	dH.Pair = gH.Pair;
	dH.Scalar = vH.Scalar;
	dH.YAMLMap = yH.YAMLMap;
	dH.YAMLSeq = kH.YAMLSeq;
	dH.CST = fH;
	dH.Lexer = mH.Lexer;
	dH.LineCounter = hH.LineCounter;
	dH.Parser = lH.Parser;
	dH.parse = sF.parse;
	dH.parseAllDocuments = sF.parseAllDocuments;
	dH.parseDocument = sF.parseDocument;
	dH.stringify = sF.stringify;
	dH.visit = BB.visit;
	dH.visitAsync = BB.visitAsync;
});
var e6 = W((xO, UB) => {
	var t6 = {
			to(D, F) {
				if (!F) return `\x1B[${D + 1}G`;
				return `\x1B[${F + 1};${D + 1}H`;
			},
			move(D, F) {
				let _ = "";
				if (D < 0) _ += `\x1B[${-D}D`;
				else if (D > 0) _ += `\x1B[${D}C`;
				if (F < 0) _ += `\x1B[${-F}A`;
				else if (F > 0) _ += `\x1B[${F}B`;
				return _;
			},
			up: (D = 1) => `\x1B[${D}A`,
			down: (D = 1) => `\x1B[${D}B`,
			forward: (D = 1) => `\x1B[${D}C`,
			backward: (D = 1) => `\x1B[${D}D`,
			nextLine: (D = 1) => "\x1B[E".repeat(D),
			prevLine: (D = 1) => "\x1B[F".repeat(D),
			left: "\x1B[G",
			hide: "\x1B[?25l",
			show: "\x1B[?25h",
			save: "\x1B7",
			restore: "\x1B8",
		},
		lK = {
			up: (D = 1) => "\x1B[S".repeat(D),
			down: (D = 1) => "\x1B[T".repeat(D),
		},
		dK = {
			screen: "\x1B[2J",
			up: (D = 1) => "\x1B[1J".repeat(D),
			down: (D = 1) => "\x1B[J".repeat(D),
			line: "\x1B[2K",
			lineEnd: "\x1B[K",
			lineStart: "\x1B[1K",
			lines(D) {
				let F = "";
				for (let _ = 0; _ < D; _++) F += this.line + (_ < D - 1 ? t6.up() : "");
				if (D) F += t6.left;
				return F;
			},
		};
	UB.exports = { cursor: t6, scroll: lK, erase: dK, beep: "\x07" };
});
var F7 = W((bO, D7) => {
	var eF = process || {},
		MB = eF.argv || [],
		tF = eF.env || {},
		cK =
			!(!!tF.NO_COLOR || MB.includes("--no-color")) &&
			(!!tF.FORCE_COLOR ||
				MB.includes("--color") ||
				eF.platform === "win32" ||
				((eF.stdout || {}).isTTY && tF.TERM !== "dumb") ||
				!!tF.CI),
		pK =
			(D, F, _ = D) =>
			(B) => {
				let $ = "" + B,
					Z = $.indexOf(F, D.length);
				return ~Z ? D + aK($, F, _, Z) + F : D + $ + F;
			},
		aK = (D, F, _, B) => {
			let $ = "",
				Z = 0;
			do
				($ += D.substring(Z, B) + _), (Z = B + F.length), (B = D.indexOf(F, Z));
			while (~B);
			return $ + D.substring(Z);
		},
		RB = (D = cK) => {
			let F = D ? pK : () => String;
			return {
				isColorSupported: D,
				reset: F("\x1B[0m", "\x1B[0m"),
				bold: F("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
				dim: F("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
				italic: F("\x1B[3m", "\x1B[23m"),
				underline: F("\x1B[4m", "\x1B[24m"),
				inverse: F("\x1B[7m", "\x1B[27m"),
				hidden: F("\x1B[8m", "\x1B[28m"),
				strikethrough: F("\x1B[9m", "\x1B[29m"),
				black: F("\x1B[30m", "\x1B[39m"),
				red: F("\x1B[31m", "\x1B[39m"),
				green: F("\x1B[32m", "\x1B[39m"),
				yellow: F("\x1B[33m", "\x1B[39m"),
				blue: F("\x1B[34m", "\x1B[39m"),
				magenta: F("\x1B[35m", "\x1B[39m"),
				cyan: F("\x1B[36m", "\x1B[39m"),
				white: F("\x1B[37m", "\x1B[39m"),
				gray: F("\x1B[90m", "\x1B[39m"),
				bgBlack: F("\x1B[40m", "\x1B[49m"),
				bgRed: F("\x1B[41m", "\x1B[49m"),
				bgGreen: F("\x1B[42m", "\x1B[49m"),
				bgYellow: F("\x1B[43m", "\x1B[49m"),
				bgBlue: F("\x1B[44m", "\x1B[49m"),
				bgMagenta: F("\x1B[45m", "\x1B[49m"),
				bgCyan: F("\x1B[46m", "\x1B[49m"),
				bgWhite: F("\x1B[47m", "\x1B[49m"),
				blackBright: F("\x1B[90m", "\x1B[39m"),
				redBright: F("\x1B[91m", "\x1B[39m"),
				greenBright: F("\x1B[92m", "\x1B[39m"),
				yellowBright: F("\x1B[93m", "\x1B[39m"),
				blueBright: F("\x1B[94m", "\x1B[39m"),
				magentaBright: F("\x1B[95m", "\x1B[39m"),
				cyanBright: F("\x1B[96m", "\x1B[39m"),
				whiteBright: F("\x1B[97m", "\x1B[39m"),
				bgBlackBright: F("\x1B[100m", "\x1B[49m"),
				bgRedBright: F("\x1B[101m", "\x1B[49m"),
				bgGreenBright: F("\x1B[102m", "\x1B[49m"),
				bgYellowBright: F("\x1B[103m", "\x1B[49m"),
				bgBlueBright: F("\x1B[104m", "\x1B[49m"),
				bgMagentaBright: F("\x1B[105m", "\x1B[49m"),
				bgCyanBright: F("\x1B[106m", "\x1B[49m"),
				bgWhiteBright: F("\x1B[107m", "\x1B[49m"),
			};
		};
	D7.exports = RB();
	D7.exports.createColors = RB;
});
var R2 = W((bw, sB) => {
	var iB = new Map([
		["C", "cwd"],
		["f", "file"],
		["z", "gzip"],
		["P", "preservePaths"],
		["U", "unlink"],
		["strip-components", "strip"],
		["stripComponents", "strip"],
		["keep-newer", "newer"],
		["keepNewer", "newer"],
		["keep-newer-files", "newer"],
		["keepNewerFiles", "newer"],
		["k", "keep"],
		["keep-existing", "keep"],
		["keepExisting", "keep"],
		["m", "noMtime"],
		["no-mtime", "noMtime"],
		["p", "preserveOwner"],
		["L", "follow"],
		["h", "follow"],
	]);
	sB.exports = (D) =>
		D
			? Object.keys(D)
					.map((F) => [iB.has(F) ? iB.get(F) : F, D[F]])
					.reduce((F, _) => ((F[_[0]] = _[1]), F), Object.create(null))
			: {};
});
var J3 = W((uY) => {
	var rB =
			typeof process === "object" && process
				? process
				: { stdout: null, stderr: null },
		PY = R("events"),
		nB = R("stream"),
		TY = R("string_decoder"),
		oB = TY.StringDecoder,
		t0 = Symbol("EOF"),
		e0 = Symbol("maybeEmitEnd"),
		OD = Symbol("emittedEnd"),
		$3 = Symbol("emittingEnd"),
		w1 = Symbol("emittedError"),
		q3 = Symbol("closed"),
		tB = Symbol("read"),
		Z3 = Symbol("flush"),
		eB = Symbol("flushChunk"),
		J0 = Symbol("encoding"),
		DD = Symbol("decoder"),
		X3 = Symbol("flowing"),
		j1 = Symbol("paused"),
		P2 = Symbol("resume"),
		d = Symbol("buffer"),
		m0 = Symbol("pipes"),
		s = Symbol("bufferLength"),
		G7 = Symbol("bufferPush"),
		V7 = Symbol("bufferShift"),
		e = Symbol("objectMode"),
		c = Symbol("destroyed"),
		C7 = Symbol("error"),
		W7 = Symbol("emitData"),
		D$ = Symbol("emitEnd"),
		H7 = Symbol("emitEnd2"),
		FD = Symbol("async"),
		K7 = Symbol("abort"),
		Q3 = Symbol("aborted"),
		oD = Symbol("signal"),
		u1 = (D) => Promise.resolve().then(D),
		B$ = global._MP_NO_ITERATOR_SYMBOLS_ !== "1",
		F$ =
			(B$ && Symbol.asyncIterator) || Symbol("asyncIterator not implemented"),
		_$ = (B$ && Symbol.iterator) || Symbol("iterator not implemented"),
		OY = (D) => D === "end" || D === "finish" || D === "prefinish",
		wY = (D) =>
			D instanceof ArrayBuffer ||
			(typeof D === "object" &&
				D.constructor &&
				D.constructor.name === "ArrayBuffer" &&
				D.byteLength >= 0),
		jY = (D) => !Buffer.isBuffer(D) && ArrayBuffer.isView(D);
	class Y7 {
		constructor(D, F, _) {
			(this.src = D),
				(this.dest = F),
				(this.opts = _),
				(this.ondrain = () => D[P2]()),
				F.on("drain", this.ondrain);
		}
		unpipe() {
			this.dest.removeListener("drain", this.ondrain);
		}
		proxyErrors() {}
		end() {
			if ((this.unpipe(), this.opts.end)) this.dest.end();
		}
	}
	class $$ extends Y7 {
		unpipe() {
			this.src.removeListener("error", this.proxyErrors), super.unpipe();
		}
		constructor(D, F, _) {
			super(D, F, _);
			(this.proxyErrors = (B) => F.emit("error", B)),
				D.on("error", this.proxyErrors);
		}
	}
	class I7 extends nB {
		constructor(D) {
			super();
			if (
				((this[X3] = !1),
				(this[j1] = !1),
				(this[m0] = []),
				(this[d] = []),
				(this[e] = (D && D.objectMode) || !1),
				this[e])
			)
				this[J0] = null;
			else this[J0] = (D && D.encoding) || null;
			if (this[J0] === "buffer") this[J0] = null;
			if (
				((this[FD] = (D && !!D.async) || !1),
				(this[DD] = this[J0] ? new oB(this[J0]) : null),
				(this[t0] = !1),
				(this[OD] = !1),
				(this[$3] = !1),
				(this[q3] = !1),
				(this[w1] = null),
				(this.writable = !0),
				(this.readable = !0),
				(this[s] = 0),
				(this[c] = !1),
				D && D.debugExposeBuffer === !0)
			)
				Object.defineProperty(this, "buffer", { get: () => this[d] });
			if (D && D.debugExposePipes === !0)
				Object.defineProperty(this, "pipes", { get: () => this[m0] });
			if (((this[oD] = D && D.signal), (this[Q3] = !1), this[oD])) {
				if (
					(this[oD].addEventListener("abort", () => this[K7]()),
					this[oD].aborted)
				)
					this[K7]();
			}
		}
		get bufferLength() {
			return this[s];
		}
		get encoding() {
			return this[J0];
		}
		set encoding(D) {
			if (this[e]) throw new Error("cannot set encoding in objectMode");
			if (
				this[J0] &&
				D !== this[J0] &&
				((this[DD] && this[DD].lastNeed) || this[s])
			)
				throw new Error("cannot change encoding");
			if (this[J0] !== D) {
				if (((this[DD] = D ? new oB(D) : null), this[d].length))
					this[d] = this[d].map((F) => this[DD].write(F));
			}
			this[J0] = D;
		}
		setEncoding(D) {
			this.encoding = D;
		}
		get objectMode() {
			return this[e];
		}
		set objectMode(D) {
			this[e] = this[e] || !!D;
		}
		get ["async"]() {
			return this[FD];
		}
		set ["async"](D) {
			this[FD] = this[FD] || !!D;
		}
		[K7]() {
			(this[Q3] = !0),
				this.emit("abort", this[oD].reason),
				this.destroy(this[oD].reason);
		}
		get aborted() {
			return this[Q3];
		}
		set aborted(D) {}
		write(D, F, _) {
			if (this[Q3]) return !1;
			if (this[t0]) throw new Error("write after end");
			if (this[c])
				return (
					this.emit(
						"error",
						Object.assign(
							new Error("Cannot call write after a stream was destroyed"),
							{ code: "ERR_STREAM_DESTROYED" },
						),
					),
					!0
				);
			if (typeof F === "function") (_ = F), (F = "utf8");
			if (!F) F = "utf8";
			let B = this[FD] ? u1 : ($) => $();
			if (!this[e] && !Buffer.isBuffer(D)) {
				if (jY(D)) D = Buffer.from(D.buffer, D.byteOffset, D.byteLength);
				else if (wY(D)) D = Buffer.from(D);
				else if (typeof D !== "string") this.objectMode = !0;
			}
			if (this[e]) {
				if (this.flowing && this[s] !== 0) this[Z3](!0);
				if (this.flowing) this.emit("data", D);
				else this[G7](D);
				if (this[s] !== 0) this.emit("readable");
				if (_) B(_);
				return this.flowing;
			}
			if (!D.length) {
				if (this[s] !== 0) this.emit("readable");
				if (_) B(_);
				return this.flowing;
			}
			if (typeof D === "string" && !(F === this[J0] && !this[DD].lastNeed))
				D = Buffer.from(D, F);
			if (Buffer.isBuffer(D) && this[J0]) D = this[DD].write(D);
			if (this.flowing && this[s] !== 0) this[Z3](!0);
			if (this.flowing) this.emit("data", D);
			else this[G7](D);
			if (this[s] !== 0) this.emit("readable");
			if (_) B(_);
			return this.flowing;
		}
		read(D) {
			if (this[c]) return null;
			if (this[s] === 0 || D === 0 || D > this[s]) return this[e0](), null;
			if (this[e]) D = null;
			if (this[d].length > 1 && !this[e])
				if (this.encoding) this[d] = [this[d].join("")];
				else this[d] = [Buffer.concat(this[d], this[s])];
			let F = this[tB](D || null, this[d][0]);
			return this[e0](), F;
		}
		[tB](D, F) {
			if (D === F.length || D === null) this[V7]();
			else (this[d][0] = F.slice(D)), (F = F.slice(0, D)), (this[s] -= D);
			if ((this.emit("data", F), !this[d].length && !this[t0]))
				this.emit("drain");
			return F;
		}
		end(D, F, _) {
			if (typeof D === "function") (_ = D), (D = null);
			if (typeof F === "function") (_ = F), (F = "utf8");
			if (D) this.write(D, F);
			if (_) this.once("end", _);
			if (((this[t0] = !0), (this.writable = !1), this.flowing || !this[j1]))
				this[e0]();
			return this;
		}
		[P2]() {
			if (this[c]) return;
			if (
				((this[j1] = !1), (this[X3] = !0), this.emit("resume"), this[d].length)
			)
				this[Z3]();
			else if (this[t0]) this[e0]();
			else this.emit("drain");
		}
		resume() {
			return this[P2]();
		}
		pause() {
			(this[X3] = !1), (this[j1] = !0);
		}
		get destroyed() {
			return this[c];
		}
		get flowing() {
			return this[X3];
		}
		get paused() {
			return this[j1];
		}
		[G7](D) {
			if (this[e]) this[s] += 1;
			else this[s] += D.length;
			this[d].push(D);
		}
		[V7]() {
			if (this[e]) this[s] -= 1;
			else this[s] -= this[d][0].length;
			return this[d].shift();
		}
		[Z3](D) {
			do;
			while (this[eB](this[V7]()) && this[d].length);
			if (!D && !this[d].length && !this[t0]) this.emit("drain");
		}
		[eB](D) {
			return this.emit("data", D), this.flowing;
		}
		pipe(D, F) {
			if (this[c]) return;
			let _ = this[OD];
			if (((F = F || {}), D === rB.stdout || D === rB.stderr)) F.end = !1;
			else F.end = F.end !== !1;
			if (((F.proxyErrors = !!F.proxyErrors), _)) {
				if (F.end) D.end();
			} else if (
				(this[m0].push(
					!F.proxyErrors ? new Y7(this, D, F) : new $$(this, D, F),
				),
				this[FD])
			)
				u1(() => this[P2]());
			else this[P2]();
			return D;
		}
		unpipe(D) {
			let F = this[m0].find((_) => _.dest === D);
			if (F) this[m0].splice(this[m0].indexOf(F), 1), F.unpipe();
		}
		addListener(D, F) {
			return this.on(D, F);
		}
		on(D, F) {
			let _ = super.on(D, F);
			if (D === "data" && !this[m0].length && !this.flowing) this[P2]();
			else if (D === "readable" && this[s] !== 0) super.emit("readable");
			else if (OY(D) && this[OD]) super.emit(D), this.removeAllListeners(D);
			else if (D === "error" && this[w1])
				if (this[FD]) u1(() => F.call(this, this[w1]));
				else F.call(this, this[w1]);
			return _;
		}
		get emittedEnd() {
			return this[OD];
		}
		[e0]() {
			if (
				!this[$3] &&
				!this[OD] &&
				!this[c] &&
				this[d].length === 0 &&
				this[t0]
			) {
				if (
					((this[$3] = !0),
					this.emit("end"),
					this.emit("prefinish"),
					this.emit("finish"),
					this[q3])
				)
					this.emit("close");
				this[$3] = !1;
			}
		}
		emit(D, F, ..._) {
			if (D !== "error" && D !== "close" && D !== c && this[c]) return;
			else if (D === "data")
				return !this[e] && !F
					? !1
					: this[FD]
						? u1(() => this[W7](F))
						: this[W7](F);
			else if (D === "end") return this[D$]();
			else if (D === "close") {
				if (((this[q3] = !0), !this[OD] && !this[c])) return;
				let $ = super.emit("close");
				return this.removeAllListeners("close"), $;
			} else if (D === "error") {
				(this[w1] = F), super.emit(C7, F);
				let $ =
					!this[oD] || this.listeners("error").length
						? super.emit("error", F)
						: !1;
				return this[e0](), $;
			} else if (D === "resume") {
				let $ = super.emit("resume");
				return this[e0](), $;
			} else if (D === "finish" || D === "prefinish") {
				let $ = super.emit(D);
				return this.removeAllListeners(D), $;
			}
			let B = super.emit(D, F, ..._);
			return this[e0](), B;
		}
		[W7](D) {
			for (let _ of this[m0]) if (_.dest.write(D) === !1) this.pause();
			let F = super.emit("data", D);
			return this[e0](), F;
		}
		[D$]() {
			if (this[OD]) return;
			if (((this[OD] = !0), (this.readable = !1), this[FD]))
				u1(() => this[H7]());
			else this[H7]();
		}
		[H7]() {
			if (this[DD]) {
				let F = this[DD].end();
				if (F) {
					for (let _ of this[m0]) _.dest.write(F);
					super.emit("data", F);
				}
			}
			for (let F of this[m0]) F.end();
			let D = super.emit("end");
			return this.removeAllListeners("end"), D;
		}
		collect() {
			let D = [];
			if (!this[e]) D.dataLength = 0;
			let F = this.promise();
			return (
				this.on("data", (_) => {
					if ((D.push(_), !this[e])) D.dataLength += _.length;
				}),
				F.then(() => D)
			);
		}
		concat() {
			return this[e]
				? Promise.reject(new Error("cannot concat in objectMode"))
				: this.collect().then((D) =>
						this[e]
							? Promise.reject(new Error("cannot concat in objectMode"))
							: this[J0]
								? D.join("")
								: Buffer.concat(D, D.dataLength),
					);
		}
		promise() {
			return new Promise((D, F) => {
				this.on(c, () => F(new Error("stream destroyed"))),
					this.on("error", (_) => F(_)),
					this.on("end", () => D());
			});
		}
		[F$]() {
			let D = !1,
				F = () => {
					return this.pause(), (D = !0), Promise.resolve({ done: !0 });
				};
			return {
				next: () => {
					if (D) return F();
					let B = this.read();
					if (B !== null) return Promise.resolve({ done: !1, value: B });
					if (this[t0]) return F();
					let $ = null,
						Z = null,
						q = (z) => {
							this.removeListener("data", X),
								this.removeListener("end", Q),
								this.removeListener(c, J),
								F(),
								Z(z);
						},
						X = (z) => {
							this.removeListener("error", q),
								this.removeListener("end", Q),
								this.removeListener(c, J),
								this.pause(),
								$({ value: z, done: !!this[t0] });
						},
						Q = () => {
							this.removeListener("error", q),
								this.removeListener("data", X),
								this.removeListener(c, J),
								F(),
								$({ done: !0 });
						},
						J = () => q(new Error("stream destroyed"));
					return new Promise((z, A) => {
						(Z = A),
							($ = z),
							this.once(c, J),
							this.once("error", q),
							this.once("end", Q),
							this.once("data", X);
					});
				},
				throw: F,
				return: F,
				[F$]() {
					return this;
				},
			};
		}
		[_$]() {
			let D = !1,
				F = () => {
					return (
						this.pause(),
						this.removeListener(C7, F),
						this.removeListener(c, F),
						this.removeListener("end", F),
						(D = !0),
						{ done: !0 }
					);
				},
				_ = () => {
					if (D) return F();
					let B = this.read();
					return B === null ? F() : { value: B };
				};
			return (
				this.once("end", F),
				this.once(C7, F),
				this.once(c, F),
				{
					next: _,
					throw: F,
					return: F,
					[_$]() {
						return this;
					},
				}
			);
		}
		destroy(D) {
			if (this[c]) {
				if (D) this.emit("error", D);
				else this.emit(c);
				return this;
			}
			if (
				((this[c] = !0),
				(this[d].length = 0),
				(this[s] = 0),
				typeof this.close === "function" && !this[q3])
			)
				this.close();
			if (D) this.emit("error", D);
			else this.emit(c);
			return this;
		}
		static isStream(D) {
			return (
				!!D &&
				(D instanceof I7 ||
					D instanceof nB ||
					(D instanceof PY &&
						(typeof D.pipe === "function" ||
							(typeof D.write === "function" && typeof D.end === "function"))))
			);
		}
	}
	uY.Minipass = I7;
});
var Z$ = W((vw, q$) => {
	var SY = R("zlib").constants || { ZLIB_VERNUM: 4736 };
	q$.exports = Object.freeze(
		Object.assign(
			Object.create(null),
			{
				Z_NO_FLUSH: 0,
				Z_PARTIAL_FLUSH: 1,
				Z_SYNC_FLUSH: 2,
				Z_FULL_FLUSH: 3,
				Z_FINISH: 4,
				Z_BLOCK: 5,
				Z_OK: 0,
				Z_STREAM_END: 1,
				Z_NEED_DICT: 2,
				Z_ERRNO: -1,
				Z_STREAM_ERROR: -2,
				Z_DATA_ERROR: -3,
				Z_MEM_ERROR: -4,
				Z_BUF_ERROR: -5,
				Z_VERSION_ERROR: -6,
				Z_NO_COMPRESSION: 0,
				Z_BEST_SPEED: 1,
				Z_BEST_COMPRESSION: 9,
				Z_DEFAULT_COMPRESSION: -1,
				Z_FILTERED: 1,
				Z_HUFFMAN_ONLY: 2,
				Z_RLE: 3,
				Z_FIXED: 4,
				Z_DEFAULT_STRATEGY: 0,
				DEFLATE: 1,
				INFLATE: 2,
				GZIP: 3,
				GUNZIP: 4,
				DEFLATERAW: 5,
				INFLATERAW: 6,
				UNZIP: 7,
				BROTLI_DECODE: 8,
				BROTLI_ENCODE: 9,
				Z_MIN_WINDOWBITS: 8,
				Z_MAX_WINDOWBITS: 15,
				Z_DEFAULT_WINDOWBITS: 15,
				Z_MIN_CHUNK: 64,
				Z_MAX_CHUNK: 1 / 0,
				Z_DEFAULT_CHUNK: 16384,
				Z_MIN_MEMLEVEL: 1,
				Z_MAX_MEMLEVEL: 9,
				Z_DEFAULT_MEMLEVEL: 8,
				Z_MIN_LEVEL: -1,
				Z_MAX_LEVEL: 9,
				Z_DEFAULT_LEVEL: -1,
				BROTLI_OPERATION_PROCESS: 0,
				BROTLI_OPERATION_FLUSH: 1,
				BROTLI_OPERATION_FINISH: 2,
				BROTLI_OPERATION_EMIT_METADATA: 3,
				BROTLI_MODE_GENERIC: 0,
				BROTLI_MODE_TEXT: 1,
				BROTLI_MODE_FONT: 2,
				BROTLI_DEFAULT_MODE: 0,
				BROTLI_MIN_QUALITY: 0,
				BROTLI_MAX_QUALITY: 11,
				BROTLI_DEFAULT_QUALITY: 11,
				BROTLI_MIN_WINDOW_BITS: 10,
				BROTLI_MAX_WINDOW_BITS: 24,
				BROTLI_LARGE_MAX_WINDOW_BITS: 30,
				BROTLI_DEFAULT_WINDOW: 22,
				BROTLI_MIN_INPUT_BLOCK_BITS: 16,
				BROTLI_MAX_INPUT_BLOCK_BITS: 24,
				BROTLI_PARAM_MODE: 0,
				BROTLI_PARAM_QUALITY: 1,
				BROTLI_PARAM_LGWIN: 2,
				BROTLI_PARAM_LGBLOCK: 3,
				BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
				BROTLI_PARAM_SIZE_HINT: 5,
				BROTLI_PARAM_LARGE_WINDOW: 6,
				BROTLI_PARAM_NPOSTFIX: 7,
				BROTLI_PARAM_NDIRECT: 8,
				BROTLI_DECODER_RESULT_ERROR: 0,
				BROTLI_DECODER_RESULT_SUCCESS: 1,
				BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
				BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
				BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
				BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
				BROTLI_DECODER_NO_ERROR: 0,
				BROTLI_DECODER_SUCCESS: 1,
				BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
				BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
				BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
				BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
				BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
				BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
				BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
				BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
				BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
				BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
				BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
				BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
				BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
				BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
				BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
				BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
				BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
				BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
				BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
				BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
				BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
				BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
				BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
				BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
				BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
				BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
				BROTLI_DECODER_ERROR_UNREACHABLE: -31,
			},
			SY,
		),
	);
});
var W$ = W((yw, C$) => {
	var X$ =
			typeof process === "object" && process
				? process
				: { stdout: null, stderr: null },
		EY = R("events"),
		Q$ = R("stream"),
		J$ = R("string_decoder").StringDecoder,
		_D = Symbol("EOF"),
		BD = Symbol("maybeEmitEnd"),
		wD = Symbol("emittedEnd"),
		z3 = Symbol("emittingEnd"),
		N1 = Symbol("emittedError"),
		A3 = Symbol("closed"),
		z$ = Symbol("read"),
		L3 = Symbol("flush"),
		A$ = Symbol("flushChunk"),
		z0 = Symbol("encoding"),
		$D = Symbol("decoder"),
		G3 = Symbol("flowing"),
		S1 = Symbol("paused"),
		T2 = Symbol("resume"),
		r = Symbol("bufferLength"),
		U7 = Symbol("bufferPush"),
		M7 = Symbol("bufferShift"),
		D0 = Symbol("objectMode"),
		F0 = Symbol("destroyed"),
		R7 = Symbol("emitData"),
		L$ = Symbol("emitEnd"),
		P7 = Symbol("emitEnd2"),
		qD = Symbol("async"),
		E1 = (D) => Promise.resolve().then(D),
		G$ = global._MP_NO_ITERATOR_SYMBOLS_ !== "1",
		xY =
			(G$ && Symbol.asyncIterator) || Symbol("asyncIterator not implemented"),
		bY = (G$ && Symbol.iterator) || Symbol("iterator not implemented"),
		gY = (D) => D === "end" || D === "finish" || D === "prefinish",
		vY = (D) =>
			D instanceof ArrayBuffer ||
			(typeof D === "object" &&
				D.constructor &&
				D.constructor.name === "ArrayBuffer" &&
				D.byteLength >= 0),
		yY = (D) => !Buffer.isBuffer(D) && ArrayBuffer.isView(D);
	class T7 {
		constructor(D, F, _) {
			(this.src = D),
				(this.dest = F),
				(this.opts = _),
				(this.ondrain = () => D[T2]()),
				F.on("drain", this.ondrain);
		}
		unpipe() {
			this.dest.removeListener("drain", this.ondrain);
		}
		proxyErrors() {}
		end() {
			if ((this.unpipe(), this.opts.end)) this.dest.end();
		}
	}
	class V$ extends T7 {
		unpipe() {
			this.src.removeListener("error", this.proxyErrors), super.unpipe();
		}
		constructor(D, F, _) {
			super(D, F, _);
			(this.proxyErrors = (B) => F.emit("error", B)),
				D.on("error", this.proxyErrors);
		}
	}
	C$.exports = class D extends Q$ {
		constructor(F) {
			super();
			if (
				((this[G3] = !1),
				(this[S1] = !1),
				(this.pipes = []),
				(this.buffer = []),
				(this[D0] = (F && F.objectMode) || !1),
				this[D0])
			)
				this[z0] = null;
			else this[z0] = (F && F.encoding) || null;
			if (this[z0] === "buffer") this[z0] = null;
			(this[qD] = (F && !!F.async) || !1),
				(this[$D] = this[z0] ? new J$(this[z0]) : null),
				(this[_D] = !1),
				(this[wD] = !1),
				(this[z3] = !1),
				(this[A3] = !1),
				(this[N1] = null),
				(this.writable = !0),
				(this.readable = !0),
				(this[r] = 0),
				(this[F0] = !1);
		}
		get bufferLength() {
			return this[r];
		}
		get encoding() {
			return this[z0];
		}
		set encoding(F) {
			if (this[D0]) throw new Error("cannot set encoding in objectMode");
			if (
				this[z0] &&
				F !== this[z0] &&
				((this[$D] && this[$D].lastNeed) || this[r])
			)
				throw new Error("cannot change encoding");
			if (this[z0] !== F) {
				if (((this[$D] = F ? new J$(F) : null), this.buffer.length))
					this.buffer = this.buffer.map((_) => this[$D].write(_));
			}
			this[z0] = F;
		}
		setEncoding(F) {
			this.encoding = F;
		}
		get objectMode() {
			return this[D0];
		}
		set objectMode(F) {
			this[D0] = this[D0] || !!F;
		}
		get ["async"]() {
			return this[qD];
		}
		set ["async"](F) {
			this[qD] = this[qD] || !!F;
		}
		write(F, _, B) {
			if (this[_D]) throw new Error("write after end");
			if (this[F0])
				return (
					this.emit(
						"error",
						Object.assign(
							new Error("Cannot call write after a stream was destroyed"),
							{ code: "ERR_STREAM_DESTROYED" },
						),
					),
					!0
				);
			if (typeof _ === "function") (B = _), (_ = "utf8");
			if (!_) _ = "utf8";
			let $ = this[qD] ? E1 : (Z) => Z();
			if (!this[D0] && !Buffer.isBuffer(F)) {
				if (yY(F)) F = Buffer.from(F.buffer, F.byteOffset, F.byteLength);
				else if (vY(F)) F = Buffer.from(F);
				else if (typeof F !== "string") this.objectMode = !0;
			}
			if (this[D0]) {
				if (this.flowing && this[r] !== 0) this[L3](!0);
				if (this.flowing) this.emit("data", F);
				else this[U7](F);
				if (this[r] !== 0) this.emit("readable");
				if (B) $(B);
				return this.flowing;
			}
			if (!F.length) {
				if (this[r] !== 0) this.emit("readable");
				if (B) $(B);
				return this.flowing;
			}
			if (typeof F === "string" && !(_ === this[z0] && !this[$D].lastNeed))
				F = Buffer.from(F, _);
			if (Buffer.isBuffer(F) && this[z0]) F = this[$D].write(F);
			if (this.flowing && this[r] !== 0) this[L3](!0);
			if (this.flowing) this.emit("data", F);
			else this[U7](F);
			if (this[r] !== 0) this.emit("readable");
			if (B) $(B);
			return this.flowing;
		}
		read(F) {
			if (this[F0]) return null;
			if (this[r] === 0 || F === 0 || F > this[r]) return this[BD](), null;
			if (this[D0]) F = null;
			if (this.buffer.length > 1 && !this[D0])
				if (this.encoding) this.buffer = [this.buffer.join("")];
				else this.buffer = [Buffer.concat(this.buffer, this[r])];
			let _ = this[z$](F || null, this.buffer[0]);
			return this[BD](), _;
		}
		[z$](F, _) {
			if (F === _.length || F === null) this[M7]();
			else (this.buffer[0] = _.slice(F)), (_ = _.slice(0, F)), (this[r] -= F);
			if ((this.emit("data", _), !this.buffer.length && !this[_D]))
				this.emit("drain");
			return _;
		}
		end(F, _, B) {
			if (typeof F === "function") (B = F), (F = null);
			if (typeof _ === "function") (B = _), (_ = "utf8");
			if (F) this.write(F, _);
			if (B) this.once("end", B);
			if (((this[_D] = !0), (this.writable = !1), this.flowing || !this[S1]))
				this[BD]();
			return this;
		}
		[T2]() {
			if (this[F0]) return;
			if (
				((this[S1] = !1),
				(this[G3] = !0),
				this.emit("resume"),
				this.buffer.length)
			)
				this[L3]();
			else if (this[_D]) this[BD]();
			else this.emit("drain");
		}
		resume() {
			return this[T2]();
		}
		pause() {
			(this[G3] = !1), (this[S1] = !0);
		}
		get destroyed() {
			return this[F0];
		}
		get flowing() {
			return this[G3];
		}
		get paused() {
			return this[S1];
		}
		[U7](F) {
			if (this[D0]) this[r] += 1;
			else this[r] += F.length;
			this.buffer.push(F);
		}
		[M7]() {
			if (this.buffer.length)
				if (this[D0]) this[r] -= 1;
				else this[r] -= this.buffer[0].length;
			return this.buffer.shift();
		}
		[L3](F) {
			do;
			while (this[A$](this[M7]()));
			if (!F && !this.buffer.length && !this[_D]) this.emit("drain");
		}
		[A$](F) {
			return F ? (this.emit("data", F), this.flowing) : !1;
		}
		pipe(F, _) {
			if (this[F0]) return;
			let B = this[wD];
			if (((_ = _ || {}), F === X$.stdout || F === X$.stderr)) _.end = !1;
			else _.end = _.end !== !1;
			if (((_.proxyErrors = !!_.proxyErrors), B)) {
				if (_.end) F.end();
			} else if (
				(this.pipes.push(
					!_.proxyErrors ? new T7(this, F, _) : new V$(this, F, _),
				),
				this[qD])
			)
				E1(() => this[T2]());
			else this[T2]();
			return F;
		}
		unpipe(F) {
			let _ = this.pipes.find((B) => B.dest === F);
			if (_) this.pipes.splice(this.pipes.indexOf(_), 1), _.unpipe();
		}
		addListener(F, _) {
			return this.on(F, _);
		}
		on(F, _) {
			let B = super.on(F, _);
			if (F === "data" && !this.pipes.length && !this.flowing) this[T2]();
			else if (F === "readable" && this[r] !== 0) super.emit("readable");
			else if (gY(F) && this[wD]) super.emit(F), this.removeAllListeners(F);
			else if (F === "error" && this[N1])
				if (this[qD]) E1(() => _.call(this, this[N1]));
				else _.call(this, this[N1]);
			return B;
		}
		get emittedEnd() {
			return this[wD];
		}
		[BD]() {
			if (
				!this[z3] &&
				!this[wD] &&
				!this[F0] &&
				this.buffer.length === 0 &&
				this[_D]
			) {
				if (
					((this[z3] = !0),
					this.emit("end"),
					this.emit("prefinish"),
					this.emit("finish"),
					this[A3])
				)
					this.emit("close");
				this[z3] = !1;
			}
		}
		emit(F, _, ...B) {
			if (F !== "error" && F !== "close" && F !== F0 && this[F0]) return;
			else if (F === "data")
				return !_ ? !1 : this[qD] ? E1(() => this[R7](_)) : this[R7](_);
			else if (F === "end") return this[L$]();
			else if (F === "close") {
				if (((this[A3] = !0), !this[wD] && !this[F0])) return;
				let Z = super.emit("close");
				return this.removeAllListeners("close"), Z;
			} else if (F === "error") {
				this[N1] = _;
				let Z = super.emit("error", _);
				return this[BD](), Z;
			} else if (F === "resume") {
				let Z = super.emit("resume");
				return this[BD](), Z;
			} else if (F === "finish" || F === "prefinish") {
				let Z = super.emit(F);
				return this.removeAllListeners(F), Z;
			}
			let $ = super.emit(F, _, ...B);
			return this[BD](), $;
		}
		[R7](F) {
			for (let B of this.pipes) if (B.dest.write(F) === !1) this.pause();
			let _ = super.emit("data", F);
			return this[BD](), _;
		}
		[L$]() {
			if (this[wD]) return;
			if (((this[wD] = !0), (this.readable = !1), this[qD]))
				E1(() => this[P7]());
			else this[P7]();
		}
		[P7]() {
			if (this[$D]) {
				let _ = this[$D].end();
				if (_) {
					for (let B of this.pipes) B.dest.write(_);
					super.emit("data", _);
				}
			}
			for (let _ of this.pipes) _.end();
			let F = super.emit("end");
			return this.removeAllListeners("end"), F;
		}
		collect() {
			let F = [];
			if (!this[D0]) F.dataLength = 0;
			let _ = this.promise();
			return (
				this.on("data", (B) => {
					if ((F.push(B), !this[D0])) F.dataLength += B.length;
				}),
				_.then(() => F)
			);
		}
		concat() {
			return this[D0]
				? Promise.reject(new Error("cannot concat in objectMode"))
				: this.collect().then((F) =>
						this[D0]
							? Promise.reject(new Error("cannot concat in objectMode"))
							: this[z0]
								? F.join("")
								: Buffer.concat(F, F.dataLength),
					);
		}
		promise() {
			return new Promise((F, _) => {
				this.on(F0, () => _(new Error("stream destroyed"))),
					this.on("error", (B) => _(B)),
					this.on("end", () => F());
			});
		}
		[xY]() {
			return {
				next: () => {
					let _ = this.read();
					if (_ !== null) return Promise.resolve({ done: !1, value: _ });
					if (this[_D]) return Promise.resolve({ done: !0 });
					let B = null,
						$ = null,
						Z = (J) => {
							this.removeListener("data", q),
								this.removeListener("end", X),
								$(J);
						},
						q = (J) => {
							this.removeListener("error", Z),
								this.removeListener("end", X),
								this.pause(),
								B({ value: J, done: !!this[_D] });
						},
						X = () => {
							this.removeListener("error", Z),
								this.removeListener("data", q),
								B({ done: !0 });
						},
						Q = () => Z(new Error("stream destroyed"));
					return new Promise((J, z) => {
						($ = z),
							(B = J),
							this.once(F0, Q),
							this.once("error", Z),
							this.once("end", X),
							this.once("data", q);
					});
				},
			};
		}
		[bY]() {
			return {
				next: () => {
					let _ = this.read();
					return { value: _, done: _ === null };
				},
			};
		}
		destroy(F) {
			if (this[F0]) {
				if (F) this.emit("error", F);
				else this.emit(F0);
				return this;
			}
			if (
				((this[F0] = !0),
				(this.buffer.length = 0),
				(this[r] = 0),
				typeof this.close === "function" && !this[A3])
			)
				this.close();
			if (F) this.emit("error", F);
			else this.emit(F0);
			return this;
		}
		static isStream(F) {
			return (
				!!F &&
				(F instanceof D ||
					F instanceof Q$ ||
					(F instanceof EY &&
						(typeof F.pipe === "function" ||
							(typeof F.write === "function" && typeof F.end === "function"))))
			);
		}
	};
});
var b7 = W((lY) => {
	var N7 = R("assert"),
		jD = R("buffer").Buffer,
		Y$ = R("zlib"),
		tD = (lY.constants = Z$()),
		mY = W$(),
		H$ = jD.concat,
		eD = Symbol("_superWrite");
	class b1 extends Error {
		constructor(D) {
			super("zlib: " + D.message);
			if (((this.code = D.code), (this.errno = D.errno), !this.code))
				this.code = "ZLIB_ERROR";
			(this.message = "zlib: " + D.message),
				Error.captureStackTrace(this, this.constructor);
		}
		get name() {
			return "ZlibError";
		}
	}
	var hY = Symbol("opts"),
		x1 = Symbol("flushFlag"),
		K$ = Symbol("finishFlushFlag"),
		S7 = Symbol("fullFlushFlag"),
		g = Symbol("handle"),
		V3 = Symbol("onError"),
		O2 = Symbol("sawError"),
		O7 = Symbol("level"),
		w7 = Symbol("strategy"),
		j7 = Symbol("ended"),
		kw = Symbol("_defaultFullFlush");
	class E7 extends mY {
		constructor(D, F) {
			if (!D || typeof D !== "object")
				throw new TypeError("invalid options for ZlibBase constructor");
			super(D);
			(this[O2] = !1),
				(this[j7] = !1),
				(this[hY] = D),
				(this[x1] = D.flush),
				(this[K$] = D.finishFlush);
			try {
				this[g] = new Y$[F](D);
			} catch (_) {
				throw new b1(_);
			}
			(this[V3] = (_) => {
				if (this[O2]) return;
				(this[O2] = !0), this.close(), this.emit("error", _);
			}),
				this[g].on("error", (_) => this[V3](new b1(_))),
				this.once("end", () => this.close);
		}
		close() {
			if (this[g]) this[g].close(), (this[g] = null), this.emit("close");
		}
		reset() {
			if (!this[O2]) return N7(this[g], "zlib binding closed"), this[g].reset();
		}
		flush(D) {
			if (this.ended) return;
			if (typeof D !== "number") D = this[S7];
			this.write(Object.assign(jD.alloc(0), { [x1]: D }));
		}
		end(D, F, _) {
			if (D) this.write(D, F);
			return this.flush(this[K$]), (this[j7] = !0), super.end(null, null, _);
		}
		get ended() {
			return this[j7];
		}
		write(D, F, _) {
			if (typeof F === "function") (_ = F), (F = "utf8");
			if (typeof D === "string") D = jD.from(D, F);
			if (this[O2]) return;
			N7(this[g], "zlib binding closed");
			let B = this[g]._handle,
				$ = B.close;
			B.close = () => {};
			let Z = this[g].close;
			(this[g].close = () => {}), (jD.concat = (Q) => Q);
			let q;
			try {
				let Q = typeof D[x1] === "number" ? D[x1] : this[x1];
				(q = this[g]._processChunk(D, Q)), (jD.concat = H$);
			} catch (Q) {
				(jD.concat = H$), this[V3](new b1(Q));
			} finally {
				if (this[g])
					(this[g]._handle = B),
						(B.close = $),
						(this[g].close = Z),
						this[g].removeAllListeners("error");
			}
			if (this[g]) this[g].on("error", (Q) => this[V3](new b1(Q)));
			let X;
			if (q)
				if (Array.isArray(q) && q.length > 0) {
					X = this[eD](jD.from(q[0]));
					for (let Q = 1; Q < q.length; Q++) X = this[eD](q[Q]);
				} else X = this[eD](jD.from(q));
			if (_) _();
			return X;
		}
		[eD](D) {
			return super.write(D);
		}
	}
	class uD extends E7 {
		constructor(D, F) {
			(D = D || {}),
				(D.flush = D.flush || tD.Z_NO_FLUSH),
				(D.finishFlush = D.finishFlush || tD.Z_FINISH);
			super(D, F);
			(this[S7] = tD.Z_FULL_FLUSH),
				(this[O7] = D.level),
				(this[w7] = D.strategy);
		}
		params(D, F) {
			if (this[O2]) return;
			if (!this[g])
				throw new Error("cannot switch params when binding is closed");
			if (!this[g].params)
				throw new Error("not supported in this implementation");
			if (this[O7] !== D || this[w7] !== F) {
				this.flush(tD.Z_SYNC_FLUSH), N7(this[g], "zlib binding closed");
				let _ = this[g].flush;
				this[g].flush = (B, $) => {
					this.flush(B), $();
				};
				try {
					this[g].params(D, F);
				} finally {
					this[g].flush = _;
				}
				if (this[g]) (this[O7] = D), (this[w7] = F);
			}
		}
	}
	class I$ extends uD {
		constructor(D) {
			super(D, "Deflate");
		}
	}
	class U$ extends uD {
		constructor(D) {
			super(D, "Inflate");
		}
	}
	var u7 = Symbol("_portable");
	class M$ extends uD {
		constructor(D) {
			super(D, "Gzip");
			this[u7] = D && !!D.portable;
		}
		[eD](D) {
			if (!this[u7]) return super[eD](D);
			return (this[u7] = !1), (D[9] = 255), super[eD](D);
		}
	}
	class R$ extends uD {
		constructor(D) {
			super(D, "Gunzip");
		}
	}
	class P$ extends uD {
		constructor(D) {
			super(D, "DeflateRaw");
		}
	}
	class T$ extends uD {
		constructor(D) {
			super(D, "InflateRaw");
		}
	}
	class O$ extends uD {
		constructor(D) {
			super(D, "Unzip");
		}
	}
	class x7 extends E7 {
		constructor(D, F) {
			(D = D || {}),
				(D.flush = D.flush || tD.BROTLI_OPERATION_PROCESS),
				(D.finishFlush = D.finishFlush || tD.BROTLI_OPERATION_FINISH);
			super(D, F);
			this[S7] = tD.BROTLI_OPERATION_FLUSH;
		}
	}
	class w$ extends x7 {
		constructor(D) {
			super(D, "BrotliCompress");
		}
	}
	class j$ extends x7 {
		constructor(D) {
			super(D, "BrotliDecompress");
		}
	}
	lY.Deflate = I$;
	lY.Inflate = U$;
	lY.Gzip = M$;
	lY.Gunzip = R$;
	lY.DeflateRaw = P$;
	lY.InflateRaw = T$;
	lY.Unzip = O$;
	if (typeof Y$.BrotliCompress === "function")
		(lY.BrotliCompress = w$), (lY.BrotliDecompress = j$);
	else
		lY.BrotliCompress = lY.BrotliDecompress = class {
			constructor() {
				throw new Error("Brotli is not supported in this version of Node.js");
			}
		};
});
var w2 = W((lw, u$) => {
	var nY = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
	u$.exports = nY !== "win32" ? (D) => D : (D) => D && D.replace(/\\/g, "/");
});
var C3 = W((dw, N$) => {
	var { Minipass: oY } = J3(),
		g7 = w2(),
		v7 = Symbol("slurp");
	N$.exports = class D extends oY {
		constructor(F, _, B) {
			super();
			switch (
				(this.pause(),
				(this.extended = _),
				(this.globalExtended = B),
				(this.header = F),
				(this.startBlockSize = 512 * Math.ceil(F.size / 512)),
				(this.blockRemain = this.startBlockSize),
				(this.remain = F.size),
				(this.type = F.type),
				(this.meta = !1),
				(this.ignore = !1),
				this.type)
			) {
				case "File":
				case "OldFile":
				case "Link":
				case "SymbolicLink":
				case "CharacterDevice":
				case "BlockDevice":
				case "Directory":
				case "FIFO":
				case "ContiguousFile":
				case "GNUDumpDir":
					break;
				case "NextFileHasLongLinkpath":
				case "NextFileHasLongPath":
				case "OldGnuLongPath":
				case "GlobalExtendedHeader":
				case "ExtendedHeader":
				case "OldExtendedHeader":
					this.meta = !0;
					break;
				default:
					this.ignore = !0;
			}
			if (((this.path = g7(F.path)), (this.mode = F.mode), this.mode))
				this.mode = this.mode & 4095;
			if (
				((this.uid = F.uid),
				(this.gid = F.gid),
				(this.uname = F.uname),
				(this.gname = F.gname),
				(this.size = F.size),
				(this.mtime = F.mtime),
				(this.atime = F.atime),
				(this.ctime = F.ctime),
				(this.linkpath = g7(F.linkpath)),
				(this.uname = F.uname),
				(this.gname = F.gname),
				_)
			)
				this[v7](_);
			if (B) this[v7](B, !0);
		}
		write(F) {
			let _ = F.length;
			if (_ > this.blockRemain)
				throw new Error("writing more to entry than is appropriate");
			let B = this.remain,
				$ = this.blockRemain;
			if (
				((this.remain = Math.max(0, B - _)),
				(this.blockRemain = Math.max(0, $ - _)),
				this.ignore)
			)
				return !0;
			if (B >= _) return super.write(F);
			return super.write(F.slice(0, B));
		}
		[v7](F, _) {
			for (let B in F)
				if (F[B] !== null && F[B] !== void 0 && !(_ && B === "path"))
					this[B] = B === "path" || B === "linkpath" ? g7(F[B]) : F[B];
		}
	};
});
var y7 = W((tY) => {
	tY.name = new Map([
		["0", "File"],
		["", "OldFile"],
		["1", "Link"],
		["2", "SymbolicLink"],
		["3", "CharacterDevice"],
		["4", "BlockDevice"],
		["5", "Directory"],
		["6", "FIFO"],
		["7", "ContiguousFile"],
		["g", "GlobalExtendedHeader"],
		["x", "ExtendedHeader"],
		["A", "SolarisACL"],
		["D", "GNUDumpDir"],
		["I", "Inode"],
		["K", "NextFileHasLongLinkpath"],
		["L", "NextFileHasLongPath"],
		["M", "ContinuationFile"],
		["N", "OldGnuLongPath"],
		["S", "SparseFile"],
		["V", "TapeVolumeHeader"],
		["X", "OldExtendedHeader"],
	]);
	tY.code = new Map(Array.from(tY.name).map((D) => [D[1], D[0]]));
});
var g$ = W((pw, b$) => {
	var DI = (D, F) => {
			if (!Number.isSafeInteger(D))
				throw Error(
					"cannot encode number outside of javascript safe integer range",
				);
			else if (D < 0) _I(D, F);
			else FI(D, F);
			return F;
		},
		FI = (D, F) => {
			F[0] = 128;
			for (var _ = F.length; _ > 1; _--)
				(F[_ - 1] = D & 255), (D = Math.floor(D / 256));
		},
		_I = (D, F) => {
			F[0] = 255;
			var _ = !1;
			D = D * -1;
			for (var B = F.length; B > 1; B--) {
				var $ = D & 255;
				if (((D = Math.floor(D / 256)), _)) F[B - 1] = E$($);
				else if ($ === 0) F[B - 1] = 0;
				else (_ = !0), (F[B - 1] = x$($));
			}
		},
		BI = (D) => {
			let F = D[0],
				_ = F === 128 ? qI(D.slice(1, D.length)) : F === 255 ? $I(D) : null;
			if (_ === null) throw Error("invalid base256 encoding");
			if (!Number.isSafeInteger(_))
				throw Error("parsed number outside of javascript safe integer range");
			return _;
		},
		$I = (D) => {
			var F = D.length,
				_ = 0,
				B = !1;
			for (var $ = F - 1; $ > -1; $--) {
				var Z = D[$],
					q;
				if (B) q = E$(Z);
				else if (Z === 0) q = Z;
				else (B = !0), (q = x$(Z));
				if (q !== 0) _ -= q * Math.pow(256, F - $ - 1);
			}
			return _;
		},
		qI = (D) => {
			var F = D.length,
				_ = 0;
			for (var B = F - 1; B > -1; B--) {
				var $ = D[B];
				if ($ !== 0) _ += $ * Math.pow(256, F - B - 1);
			}
			return _;
		},
		E$ = (D) => (255 ^ D) & 255,
		x$ = (D) => ((255 ^ D) + 1) & 255;
	b$.exports = { encode: DI, parse: BI };
});
var u2 = W((aw, k$) => {
	var k7 = y7(),
		j2 = R("path").posix,
		v$ = g$(),
		f7 = Symbol("slurp"),
		C0 = Symbol("type");
	class y$ {
		constructor(D, F, _, B) {
			if (
				((this.cksumValid = !1),
				(this.needPax = !1),
				(this.nullBlock = !1),
				(this.block = null),
				(this.path = null),
				(this.mode = null),
				(this.uid = null),
				(this.gid = null),
				(this.size = null),
				(this.mtime = null),
				(this.cksum = null),
				(this[C0] = "0"),
				(this.linkpath = null),
				(this.uname = null),
				(this.gname = null),
				(this.devmaj = 0),
				(this.devmin = 0),
				(this.atime = null),
				(this.ctime = null),
				Buffer.isBuffer(D))
			)
				this.decode(D, F || 0, _, B);
			else if (D) this.set(D);
		}
		decode(D, F, _, B) {
			if (!F) F = 0;
			if (!D || !(D.length >= F + 512))
				throw new Error("need 512 bytes for header");
			if (
				((this.path = D2(D, F, 100)),
				(this.mode = ND(D, F + 100, 8)),
				(this.uid = ND(D, F + 108, 8)),
				(this.gid = ND(D, F + 116, 8)),
				(this.size = ND(D, F + 124, 12)),
				(this.mtime = m7(D, F + 136, 12)),
				(this.cksum = ND(D, F + 148, 12)),
				this[f7](_),
				this[f7](B, !0),
				(this[C0] = D2(D, F + 156, 1)),
				this[C0] === "")
			)
				this[C0] = "0";
			if (this[C0] === "0" && this.path.slice(-1) === "/") this[C0] = "5";
			if (this[C0] === "5") this.size = 0;
			if (
				((this.linkpath = D2(D, F + 157, 100)),
				D.slice(F + 257, F + 265).toString() === "ustar\x0000")
			)
				if (
					((this.uname = D2(D, F + 265, 32)),
					(this.gname = D2(D, F + 297, 32)),
					(this.devmaj = ND(D, F + 329, 8)),
					(this.devmin = ND(D, F + 337, 8)),
					D[F + 475] !== 0)
				) {
					let Z = D2(D, F + 345, 155);
					this.path = Z + "/" + this.path;
				} else {
					let Z = D2(D, F + 345, 130);
					if (Z) this.path = Z + "/" + this.path;
					(this.atime = m7(D, F + 476, 12)), (this.ctime = m7(D, F + 488, 12));
				}
			let $ = 256;
			for (let Z = F; Z < F + 148; Z++) $ += D[Z];
			for (let Z = F + 156; Z < F + 512; Z++) $ += D[Z];
			if (
				((this.cksumValid = $ === this.cksum), this.cksum === null && $ === 256)
			)
				this.nullBlock = !0;
		}
		[f7](D, F) {
			for (let _ in D)
				if (D[_] !== null && D[_] !== void 0 && !(F && _ === "path"))
					this[_] = D[_];
		}
		encode(D, F) {
			if (!D) (D = this.block = Buffer.alloc(512)), (F = 0);
			if (!F) F = 0;
			if (!(D.length >= F + 512)) throw new Error("need 512 bytes for header");
			let _ = this.ctime || this.atime ? 130 : 155,
				B = ZI(this.path || "", _),
				$ = B[0],
				Z = B[1];
			if (
				((this.needPax = B[2]),
				(this.needPax = F2(D, F, 100, $) || this.needPax),
				(this.needPax = SD(D, F + 100, 8, this.mode) || this.needPax),
				(this.needPax = SD(D, F + 108, 8, this.uid) || this.needPax),
				(this.needPax = SD(D, F + 116, 8, this.gid) || this.needPax),
				(this.needPax = SD(D, F + 124, 12, this.size) || this.needPax),
				(this.needPax = h7(D, F + 136, 12, this.mtime) || this.needPax),
				(D[F + 156] = this[C0].charCodeAt(0)),
				(this.needPax = F2(D, F + 157, 100, this.linkpath) || this.needPax),
				D.write("ustar\x0000", F + 257, 8),
				(this.needPax = F2(D, F + 265, 32, this.uname) || this.needPax),
				(this.needPax = F2(D, F + 297, 32, this.gname) || this.needPax),
				(this.needPax = SD(D, F + 329, 8, this.devmaj) || this.needPax),
				(this.needPax = SD(D, F + 337, 8, this.devmin) || this.needPax),
				(this.needPax = F2(D, F + 345, _, Z) || this.needPax),
				D[F + 475] !== 0)
			)
				this.needPax = F2(D, F + 345, 155, Z) || this.needPax;
			else
				(this.needPax = F2(D, F + 345, 130, Z) || this.needPax),
					(this.needPax = h7(D, F + 476, 12, this.atime) || this.needPax),
					(this.needPax = h7(D, F + 488, 12, this.ctime) || this.needPax);
			let q = 256;
			for (let X = F; X < F + 148; X++) q += D[X];
			for (let X = F + 156; X < F + 512; X++) q += D[X];
			return (
				(this.cksum = q),
				SD(D, F + 148, 8, this.cksum),
				(this.cksumValid = !0),
				this.needPax
			);
		}
		set(D) {
			for (let F in D) if (D[F] !== null && D[F] !== void 0) this[F] = D[F];
		}
		get type() {
			return k7.name.get(this[C0]) || this[C0];
		}
		get typeKey() {
			return this[C0];
		}
		set type(D) {
			if (k7.code.has(D)) this[C0] = k7.code.get(D);
			else this[C0] = D;
		}
	}
	var ZI = (D, F) => {
			let B = D,
				$ = "",
				Z,
				q = j2.parse(D).root || ".";
			if (Buffer.byteLength(B) < 100) Z = [B, $, !1];
			else {
				($ = j2.dirname(B)), (B = j2.basename(B));
				do
					if (Buffer.byteLength(B) <= 100 && Buffer.byteLength($) <= F)
						Z = [B, $, !1];
					else if (Buffer.byteLength(B) > 100 && Buffer.byteLength($) <= F)
						Z = [B.slice(0, 99), $, !0];
					else (B = j2.join(j2.basename($), B)), ($ = j2.dirname($));
				while ($ !== q && !Z);
				if (!Z) Z = [D.slice(0, 99), "", !0];
			}
			return Z;
		},
		D2 = (D, F, _) =>
			D.slice(F, F + _)
				.toString("utf8")
				.replace(/\0.*/, ""),
		m7 = (D, F, _) => XI(ND(D, F, _)),
		XI = (D) => (D === null ? null : new Date(D * 1000)),
		ND = (D, F, _) => (D[F] & 128 ? v$.parse(D.slice(F, F + _)) : JI(D, F, _)),
		QI = (D) => (isNaN(D) ? null : D),
		JI = (D, F, _) =>
			QI(
				parseInt(
					D.slice(F, F + _)
						.toString("utf8")
						.replace(/\0.*$/, "")
						.trim(),
					8,
				),
			),
		zI = { 12: 8589934591, 8: 2097151 },
		SD = (D, F, _, B) =>
			B === null
				? !1
				: B > zI[_] || B < 0
					? (v$.encode(B, D.slice(F, F + _)), !0)
					: (AI(D, F, _, B), !1),
		AI = (D, F, _, B) => D.write(LI(B, _), F, _, "ascii"),
		LI = (D, F) => GI(Math.floor(D).toString(8), F),
		GI = (D, F) =>
			(D.length === F - 1
				? D
				: new Array(F - D.length - 1).join("0") + D + " ") + "\x00",
		h7 = (D, F, _, B) => (B === null ? !1 : SD(D, F, _, B.getTime() / 1000)),
		VI = new Array(156).join("\x00"),
		F2 = (D, F, _, B) =>
			B === null
				? !1
				: (D.write(B + VI, F, _, "utf8"),
					B.length !== Buffer.byteLength(B) || B.length > _);
	k$.exports = y$;
});
var H3 = W((iw, f$) => {
	var CI = u2(),
		WI = R("path");
	class W3 {
		constructor(D, F) {
			(this.atime = D.atime || null),
				(this.charset = D.charset || null),
				(this.comment = D.comment || null),
				(this.ctime = D.ctime || null),
				(this.gid = D.gid || null),
				(this.gname = D.gname || null),
				(this.linkpath = D.linkpath || null),
				(this.mtime = D.mtime || null),
				(this.path = D.path || null),
				(this.size = D.size || null),
				(this.uid = D.uid || null),
				(this.uname = D.uname || null),
				(this.dev = D.dev || null),
				(this.ino = D.ino || null),
				(this.nlink = D.nlink || null),
				(this.global = F || !1);
		}
		encode() {
			let D = this.encodeBody();
			if (D === "") return null;
			let F = Buffer.byteLength(D),
				_ = 512 * Math.ceil(1 + F / 512),
				B = Buffer.allocUnsafe(_);
			for (let $ = 0; $ < 512; $++) B[$] = 0;
			new CI({
				path: ("PaxHeader/" + WI.basename(this.path)).slice(0, 99),
				mode: this.mode || 420,
				uid: this.uid || null,
				gid: this.gid || null,
				size: F,
				mtime: this.mtime || null,
				type: this.global ? "GlobalExtendedHeader" : "ExtendedHeader",
				linkpath: "",
				uname: this.uname || "",
				gname: this.gname || "",
				devmaj: 0,
				devmin: 0,
				atime: this.atime || null,
				ctime: this.ctime || null,
			}).encode(B),
				B.write(D, 512, F, "utf8");
			for (let $ = F + 512; $ < B.length; $++) B[$] = 0;
			return B;
		}
		encodeBody() {
			return (
				this.encodeField("path") +
				this.encodeField("ctime") +
				this.encodeField("atime") +
				this.encodeField("dev") +
				this.encodeField("ino") +
				this.encodeField("nlink") +
				this.encodeField("charset") +
				this.encodeField("comment") +
				this.encodeField("gid") +
				this.encodeField("gname") +
				this.encodeField("linkpath") +
				this.encodeField("mtime") +
				this.encodeField("size") +
				this.encodeField("uid") +
				this.encodeField("uname")
			);
		}
		encodeField(D) {
			if (this[D] === null || this[D] === void 0) return "";
			let F = this[D] instanceof Date ? this[D].getTime() / 1000 : this[D],
				_ =
					" " +
					(D === "dev" || D === "ino" || D === "nlink" ? "SCHILY." : "") +
					D +
					"=" +
					F +
					`
`,
				B = Buffer.byteLength(_),
				$ = Math.floor(Math.log(B) / Math.log(10)) + 1;
			if (B + $ >= Math.pow(10, $)) $ += 1;
			return $ + B + _;
		}
	}
	W3.parse = (D, F, _) => new W3(HI(KI(D), F), _);
	var HI = (D, F) =>
			F ? Object.keys(D).reduce((_, B) => ((_[B] = D[B]), _), F) : D,
		KI = (D) =>
			D.replace(/\n$/, "")
				.split(`
`)
				.reduce(YI, Object.create(null)),
		YI = (D, F) => {
			let _ = parseInt(F, 10);
			if (_ !== Buffer.byteLength(F) + 1) return D;
			F = F.slice((_ + " ").length);
			let B = F.split("="),
				$ = B.shift().replace(/^SCHILY\.(dev|ino|nlink)/, "$1");
			if (!$) return D;
			let Z = B.join("=");
			return (
				(D[$] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test($)
					? new Date(Z * 1000)
					: /^[0-9]+$/.test(Z)
						? +Z
						: Z),
				D
			);
		};
	f$.exports = W3;
});
var N2 = W((sw, m$) => {
	m$.exports = (D) => {
		let F = D.length - 1,
			_ = -1;
		while (F > -1 && D.charAt(F) === "/") (_ = F), F--;
		return _ === -1 ? D : D.slice(0, _);
	};
});
var K3 = W((rw, h$) => {
	h$.exports = (D) =>
		class extends D {
			warn(F, _, B = {}) {
				if (this.file) B.file = this.file;
				if (this.cwd) B.cwd = this.cwd;
				if (
					((B.code = (_ instanceof Error && _.code) || F),
					(B.tarCode = F),
					!this.strict && B.recoverable !== !1)
				) {
					if (_ instanceof Error) (B = Object.assign(_, B)), (_ = _.message);
					this.emit("warn", B.tarCode, _, B);
				} else if (_ instanceof Error) this.emit("error", Object.assign(_, B));
				else this.emit("error", Object.assign(new Error(`${F}: ${_}`), B));
			}
		};
});
var d7 = W((ow, l$) => {
	var Y3 = ["|", "<", ">", "?", ":"],
		l7 = Y3.map((D) => String.fromCharCode(61440 + D.charCodeAt(0))),
		II = new Map(Y3.map((D, F) => [D, l7[F]])),
		UI = new Map(l7.map((D, F) => [D, Y3[F]]));
	l$.exports = {
		encode: (D) => Y3.reduce((F, _) => F.split(_).join(II.get(_)), D),
		decode: (D) => l7.reduce((F, _) => F.split(_).join(UI.get(_)), D),
	};
});
var c7 = W((tw, c$) => {
	var { isAbsolute: MI, parse: d$ } = R("path").win32;
	c$.exports = (D) => {
		let F = "",
			_ = d$(D);
		while (MI(D) || _.root) {
			let B = D.charAt(0) === "/" && D.slice(0, 4) !== "//?/" ? "/" : _.root;
			(D = D.slice(B.length)), (F += B), (_ = d$(D));
		}
		return [F, D];
	};
});
var a$ = W((ew, p$) => {
	p$.exports = (D, F, _) => {
		if (((D &= 4095), _)) D = (D | 384) & -19;
		if (F) {
			if (D & 256) D |= 64;
			if (D & 32) D |= 8;
			if (D & 4) D |= 1;
		}
		return D;
	};
});
var e7 = W((Dj, Xq) => {
	var { Minipass: e$ } = J3(),
		Dq = H3(),
		Fq = u2(),
		l0 = R("fs"),
		i$ = R("path"),
		h0 = w2(),
		RI = N2(),
		_q = (D, F) => {
			if (!F) return h0(D);
			return (D = h0(D).replace(/^\.(\/|$)/, "")), RI(F) + "/" + D;
		},
		s$ = Symbol("process"),
		r$ = Symbol("file"),
		n$ = Symbol("directory"),
		a7 = Symbol("symlink"),
		o$ = Symbol("hardlink"),
		g1 = Symbol("header"),
		I3 = Symbol("read"),
		i7 = Symbol("lstat"),
		U3 = Symbol("onlstat"),
		s7 = Symbol("onread"),
		r7 = Symbol("onreadlink"),
		n7 = Symbol("openfile"),
		o7 = Symbol("onopenfile"),
		ED = Symbol("close"),
		M3 = Symbol("mode"),
		t7 = Symbol("awaitDrain"),
		p7 = Symbol("ondrain"),
		d0 = Symbol("prefix"),
		t$ = Symbol("hadError"),
		Bq = K3(),
		PI = d7(),
		$q = c7(),
		qq = a$(),
		R3 = Bq(
			class D extends e$ {
				constructor(F, _) {
					_ = _ || {};
					super(_);
					if (typeof F !== "string") throw new TypeError("path is required");
					if (
						((this.path = h0(F)),
						(this.portable = !!_.portable),
						(this.myuid = (process.getuid && process.getuid()) || 0),
						(this.myuser = process.env.USER || ""),
						(this.maxReadSize = _.maxReadSize || 16777216),
						(this.linkCache = _.linkCache || new Map()),
						(this.statCache = _.statCache || new Map()),
						(this.preservePaths = !!_.preservePaths),
						(this.cwd = h0(_.cwd || process.cwd())),
						(this.strict = !!_.strict),
						(this.noPax = !!_.noPax),
						(this.noMtime = !!_.noMtime),
						(this.mtime = _.mtime || null),
						(this.prefix = _.prefix ? h0(_.prefix) : null),
						(this.fd = null),
						(this.blockLen = null),
						(this.blockRemain = null),
						(this.buf = null),
						(this.offset = null),
						(this.length = null),
						(this.pos = null),
						(this.remain = null),
						typeof _.onwarn === "function")
					)
						this.on("warn", _.onwarn);
					let B = !1;
					if (!this.preservePaths) {
						let [$, Z] = $q(this.path);
						if ($) (this.path = Z), (B = $);
					}
					if (
						((this.win32 = !!_.win32 || process.platform === "win32"),
						this.win32)
					)
						(this.path = PI.decode(this.path.replace(/\\/g, "/"))),
							(F = F.replace(/\\/g, "/"));
					if (
						((this.absolute = h0(_.absolute || i$.resolve(this.cwd, F))),
						this.path === "")
					)
						this.path = "./";
					if (B)
						this.warn("TAR_ENTRY_INFO", `stripping ${B} from absolute path`, {
							entry: this,
							path: B + this.path,
						});
					if (this.statCache.has(this.absolute))
						this[U3](this.statCache.get(this.absolute));
					else this[i7]();
				}
				emit(F, ..._) {
					if (F === "error") this[t$] = !0;
					return super.emit(F, ..._);
				}
				[i7]() {
					l0.lstat(this.absolute, (F, _) => {
						if (F) return this.emit("error", F);
						this[U3](_);
					});
				}
				[U3](F) {
					if (
						(this.statCache.set(this.absolute, F), (this.stat = F), !F.isFile())
					)
						F.size = 0;
					(this.type = OI(F)), this.emit("stat", F), this[s$]();
				}
				[s$]() {
					switch (this.type) {
						case "File":
							return this[r$]();
						case "Directory":
							return this[n$]();
						case "SymbolicLink":
							return this[a7]();
						default:
							return this.end();
					}
				}
				[M3](F) {
					return qq(F, this.type === "Directory", this.portable);
				}
				[d0](F) {
					return _q(F, this.prefix);
				}
				[g1]() {
					if (this.type === "Directory" && this.portable) this.noMtime = !0;
					if (
						((this.header = new Fq({
							path: this[d0](this.path),
							linkpath:
								this.type === "Link" ? this[d0](this.linkpath) : this.linkpath,
							mode: this[M3](this.stat.mode),
							uid: this.portable ? null : this.stat.uid,
							gid: this.portable ? null : this.stat.gid,
							size: this.stat.size,
							mtime: this.noMtime ? null : this.mtime || this.stat.mtime,
							type: this.type,
							uname: this.portable
								? null
								: this.stat.uid === this.myuid
									? this.myuser
									: "",
							atime: this.portable ? null : this.stat.atime,
							ctime: this.portable ? null : this.stat.ctime,
						})),
						this.header.encode() && !this.noPax)
					)
						super.write(
							new Dq({
								atime: this.portable ? null : this.header.atime,
								ctime: this.portable ? null : this.header.ctime,
								gid: this.portable ? null : this.header.gid,
								mtime: this.noMtime ? null : this.mtime || this.header.mtime,
								path: this[d0](this.path),
								linkpath:
									this.type === "Link"
										? this[d0](this.linkpath)
										: this.linkpath,
								size: this.header.size,
								uid: this.portable ? null : this.header.uid,
								uname: this.portable ? null : this.header.uname,
								dev: this.portable ? null : this.stat.dev,
								ino: this.portable ? null : this.stat.ino,
								nlink: this.portable ? null : this.stat.nlink,
							}).encode(),
						);
					super.write(this.header.block);
				}
				[n$]() {
					if (this.path.slice(-1) !== "/") this.path += "/";
					(this.stat.size = 0), this[g1](), this.end();
				}
				[a7]() {
					l0.readlink(this.absolute, (F, _) => {
						if (F) return this.emit("error", F);
						this[r7](_);
					});
				}
				[r7](F) {
					(this.linkpath = h0(F)), this[g1](), this.end();
				}
				[o$](F) {
					(this.type = "Link"),
						(this.linkpath = h0(i$.relative(this.cwd, F))),
						(this.stat.size = 0),
						this[g1](),
						this.end();
				}
				[r$]() {
					if (this.stat.nlink > 1) {
						let F = this.stat.dev + ":" + this.stat.ino;
						if (this.linkCache.has(F)) {
							let _ = this.linkCache.get(F);
							if (_.indexOf(this.cwd) === 0) return this[o$](_);
						}
						this.linkCache.set(F, this.absolute);
					}
					if ((this[g1](), this.stat.size === 0)) return this.end();
					this[n7]();
				}
				[n7]() {
					l0.open(this.absolute, "r", (F, _) => {
						if (F) return this.emit("error", F);
						this[o7](_);
					});
				}
				[o7](F) {
					if (((this.fd = F), this[t$])) return this[ED]();
					(this.blockLen = 512 * Math.ceil(this.stat.size / 512)),
						(this.blockRemain = this.blockLen);
					let _ = Math.min(this.blockLen, this.maxReadSize);
					(this.buf = Buffer.allocUnsafe(_)),
						(this.offset = 0),
						(this.pos = 0),
						(this.remain = this.stat.size),
						(this.length = this.buf.length),
						this[I3]();
				}
				[I3]() {
					let { fd: F, buf: _, offset: B, length: $, pos: Z } = this;
					l0.read(F, _, B, $, Z, (q, X) => {
						if (q) return this[ED](() => this.emit("error", q));
						this[s7](X);
					});
				}
				[ED](F) {
					l0.close(this.fd, F);
				}
				[s7](F) {
					if (F <= 0 && this.remain > 0) {
						let $ = new Error("encountered unexpected EOF");
						return (
							($.path = this.absolute),
							($.syscall = "read"),
							($.code = "EOF"),
							this[ED](() => this.emit("error", $))
						);
					}
					if (F > this.remain) {
						let $ = new Error("did not encounter expected EOF");
						return (
							($.path = this.absolute),
							($.syscall = "read"),
							($.code = "EOF"),
							this[ED](() => this.emit("error", $))
						);
					}
					if (F === this.remain)
						for (let $ = F; $ < this.length && F < this.blockRemain; $++)
							(this.buf[$ + this.offset] = 0), F++, this.remain++;
					let _ =
						this.offset === 0 && F === this.buf.length
							? this.buf
							: this.buf.slice(this.offset, this.offset + F);
					if (!this.write(_)) this[t7](() => this[p7]());
					else this[p7]();
				}
				[t7](F) {
					this.once("drain", F);
				}
				write(F) {
					if (this.blockRemain < F.length) {
						let _ = new Error("writing more data than expected");
						return (_.path = this.absolute), this.emit("error", _);
					}
					return (
						(this.remain -= F.length),
						(this.blockRemain -= F.length),
						(this.pos += F.length),
						(this.offset += F.length),
						super.write(F)
					);
				}
				[p7]() {
					if (!this.remain) {
						if (this.blockRemain) super.write(Buffer.alloc(this.blockRemain));
						return this[ED]((F) => (F ? this.emit("error", F) : this.end()));
					}
					if (this.offset >= this.length)
						(this.buf = Buffer.allocUnsafe(
							Math.min(this.blockRemain, this.buf.length),
						)),
							(this.offset = 0);
					(this.length = this.buf.length - this.offset), this[I3]();
				}
			},
		);
	class Zq extends R3 {
		[i7]() {
			this[U3](l0.lstatSync(this.absolute));
		}
		[a7]() {
			this[r7](l0.readlinkSync(this.absolute));
		}
		[n7]() {
			this[o7](l0.openSync(this.absolute, "r"));
		}
		[I3]() {
			let D = !0;
			try {
				let { fd: F, buf: _, offset: B, length: $, pos: Z } = this,
					q = l0.readSync(F, _, B, $, Z);
				this[s7](q), (D = !1);
			} finally {
				if (D)
					try {
						this[ED](() => {});
					} catch (F) {}
			}
		}
		[t7](D) {
			D();
		}
		[ED](D) {
			l0.closeSync(this.fd), D();
		}
	}
	var TI = Bq(
		class D extends e$ {
			constructor(F, _) {
				_ = _ || {};
				super(_);
				if (
					((this.preservePaths = !!_.preservePaths),
					(this.portable = !!_.portable),
					(this.strict = !!_.strict),
					(this.noPax = !!_.noPax),
					(this.noMtime = !!_.noMtime),
					(this.readEntry = F),
					(this.type = F.type),
					this.type === "Directory" && this.portable)
				)
					this.noMtime = !0;
				if (
					((this.prefix = _.prefix || null),
					(this.path = h0(F.path)),
					(this.mode = this[M3](F.mode)),
					(this.uid = this.portable ? null : F.uid),
					(this.gid = this.portable ? null : F.gid),
					(this.uname = this.portable ? null : F.uname),
					(this.gname = this.portable ? null : F.gname),
					(this.size = F.size),
					(this.mtime = this.noMtime ? null : _.mtime || F.mtime),
					(this.atime = this.portable ? null : F.atime),
					(this.ctime = this.portable ? null : F.ctime),
					(this.linkpath = h0(F.linkpath)),
					typeof _.onwarn === "function")
				)
					this.on("warn", _.onwarn);
				let B = !1;
				if (!this.preservePaths) {
					let [$, Z] = $q(this.path);
					if ($) (this.path = Z), (B = $);
				}
				if (
					((this.remain = F.size),
					(this.blockRemain = F.startBlockSize),
					(this.header = new Fq({
						path: this[d0](this.path),
						linkpath:
							this.type === "Link" ? this[d0](this.linkpath) : this.linkpath,
						mode: this.mode,
						uid: this.portable ? null : this.uid,
						gid: this.portable ? null : this.gid,
						size: this.size,
						mtime: this.noMtime ? null : this.mtime,
						type: this.type,
						uname: this.portable ? null : this.uname,
						atime: this.portable ? null : this.atime,
						ctime: this.portable ? null : this.ctime,
					})),
					B)
				)
					this.warn("TAR_ENTRY_INFO", `stripping ${B} from absolute path`, {
						entry: this,
						path: B + this.path,
					});
				if (this.header.encode() && !this.noPax)
					super.write(
						new Dq({
							atime: this.portable ? null : this.atime,
							ctime: this.portable ? null : this.ctime,
							gid: this.portable ? null : this.gid,
							mtime: this.noMtime ? null : this.mtime,
							path: this[d0](this.path),
							linkpath:
								this.type === "Link" ? this[d0](this.linkpath) : this.linkpath,
							size: this.size,
							uid: this.portable ? null : this.uid,
							uname: this.portable ? null : this.uname,
							dev: this.portable ? null : this.readEntry.dev,
							ino: this.portable ? null : this.readEntry.ino,
							nlink: this.portable ? null : this.readEntry.nlink,
						}).encode(),
					);
				super.write(this.header.block), F.pipe(this);
			}
			[d0](F) {
				return _q(F, this.prefix);
			}
			[M3](F) {
				return qq(F, this.type === "Directory", this.portable);
			}
			write(F) {
				let _ = F.length;
				if (_ > this.blockRemain)
					throw new Error("writing more to entry than is appropriate");
				return (this.blockRemain -= _), super.write(F);
			}
			end() {
				if (this.blockRemain) super.write(Buffer.alloc(this.blockRemain));
				return super.end();
			}
		},
	);
	R3.Sync = Zq;
	R3.Tar = TI;
	var OI = (D) =>
		D.isFile()
			? "File"
			: D.isDirectory()
				? "Directory"
				: D.isSymbolicLink()
					? "SymbolicLink"
					: "Unsupported";
	Xq.exports = R3;
});
var Jq = W((Fj, Qq) => {
	Qq.exports = function (D) {
		D.prototype[Symbol.iterator] = function* () {
			for (let F = this.head; F; F = F.next) yield F.value;
		};
	};
});
var D9 = W((_j, zq) => {
	zq.exports = u;
	u.Node = _2;
	u.create = u;
	function u(D) {
		var F = this;
		if (!(F instanceof u)) F = new u();
		if (
			((F.tail = null),
			(F.head = null),
			(F.length = 0),
			D && typeof D.forEach === "function")
		)
			D.forEach(function ($) {
				F.push($);
			});
		else if (arguments.length > 0)
			for (var _ = 0, B = arguments.length; _ < B; _++) F.push(arguments[_]);
		return F;
	}
	u.prototype.removeNode = function (D) {
		if (D.list !== this)
			throw new Error("removing node which does not belong to this list");
		var { next: F, prev: _ } = D;
		if (F) F.prev = _;
		if (_) _.next = F;
		if (D === this.head) this.head = F;
		if (D === this.tail) this.tail = _;
		return (
			D.list.length--, (D.next = null), (D.prev = null), (D.list = null), F
		);
	};
	u.prototype.unshiftNode = function (D) {
		if (D === this.head) return;
		if (D.list) D.list.removeNode(D);
		var F = this.head;
		if (((D.list = this), (D.next = F), F)) F.prev = D;
		if (((this.head = D), !this.tail)) this.tail = D;
		this.length++;
	};
	u.prototype.pushNode = function (D) {
		if (D === this.tail) return;
		if (D.list) D.list.removeNode(D);
		var F = this.tail;
		if (((D.list = this), (D.prev = F), F)) F.next = D;
		if (((this.tail = D), !this.head)) this.head = D;
		this.length++;
	};
	u.prototype.push = function () {
		for (var D = 0, F = arguments.length; D < F; D++) jI(this, arguments[D]);
		return this.length;
	};
	u.prototype.unshift = function () {
		for (var D = 0, F = arguments.length; D < F; D++) uI(this, arguments[D]);
		return this.length;
	};
	u.prototype.pop = function () {
		if (!this.tail) return;
		var D = this.tail.value;
		if (((this.tail = this.tail.prev), this.tail)) this.tail.next = null;
		else this.head = null;
		return this.length--, D;
	};
	u.prototype.shift = function () {
		if (!this.head) return;
		var D = this.head.value;
		if (((this.head = this.head.next), this.head)) this.head.prev = null;
		else this.tail = null;
		return this.length--, D;
	};
	u.prototype.forEach = function (D, F) {
		F = F || this;
		for (var _ = this.head, B = 0; _ !== null; B++)
			D.call(F, _.value, B, this), (_ = _.next);
	};
	u.prototype.forEachReverse = function (D, F) {
		F = F || this;
		for (var _ = this.tail, B = this.length - 1; _ !== null; B--)
			D.call(F, _.value, B, this), (_ = _.prev);
	};
	u.prototype.get = function (D) {
		for (var F = 0, _ = this.head; _ !== null && F < D; F++) _ = _.next;
		if (F === D && _ !== null) return _.value;
	};
	u.prototype.getReverse = function (D) {
		for (var F = 0, _ = this.tail; _ !== null && F < D; F++) _ = _.prev;
		if (F === D && _ !== null) return _.value;
	};
	u.prototype.map = function (D, F) {
		F = F || this;
		var _ = new u();
		for (var B = this.head; B !== null; )
			_.push(D.call(F, B.value, this)), (B = B.next);
		return _;
	};
	u.prototype.mapReverse = function (D, F) {
		F = F || this;
		var _ = new u();
		for (var B = this.tail; B !== null; )
			_.push(D.call(F, B.value, this)), (B = B.prev);
		return _;
	};
	u.prototype.reduce = function (D, F) {
		var _,
			B = this.head;
		if (arguments.length > 1) _ = F;
		else if (this.head) (B = this.head.next), (_ = this.head.value);
		else throw new TypeError("Reduce of empty list with no initial value");
		for (var $ = 0; B !== null; $++) (_ = D(_, B.value, $)), (B = B.next);
		return _;
	};
	u.prototype.reduceReverse = function (D, F) {
		var _,
			B = this.tail;
		if (arguments.length > 1) _ = F;
		else if (this.tail) (B = this.tail.prev), (_ = this.tail.value);
		else throw new TypeError("Reduce of empty list with no initial value");
		for (var $ = this.length - 1; B !== null; $--)
			(_ = D(_, B.value, $)), (B = B.prev);
		return _;
	};
	u.prototype.toArray = function () {
		var D = new Array(this.length);
		for (var F = 0, _ = this.head; _ !== null; F++)
			(D[F] = _.value), (_ = _.next);
		return D;
	};
	u.prototype.toArrayReverse = function () {
		var D = new Array(this.length);
		for (var F = 0, _ = this.tail; _ !== null; F++)
			(D[F] = _.value), (_ = _.prev);
		return D;
	};
	u.prototype.slice = function (D, F) {
		if (((F = F || this.length), F < 0)) F += this.length;
		if (((D = D || 0), D < 0)) D += this.length;
		var _ = new u();
		if (F < D || F < 0) return _;
		if (D < 0) D = 0;
		if (F > this.length) F = this.length;
		for (var B = 0, $ = this.head; $ !== null && B < D; B++) $ = $.next;
		for (; $ !== null && B < F; B++, $ = $.next) _.push($.value);
		return _;
	};
	u.prototype.sliceReverse = function (D, F) {
		if (((F = F || this.length), F < 0)) F += this.length;
		if (((D = D || 0), D < 0)) D += this.length;
		var _ = new u();
		if (F < D || F < 0) return _;
		if (D < 0) D = 0;
		if (F > this.length) F = this.length;
		for (var B = this.length, $ = this.tail; $ !== null && B > F; B--)
			$ = $.prev;
		for (; $ !== null && B > D; B--, $ = $.prev) _.push($.value);
		return _;
	};
	u.prototype.splice = function (D, F, ..._) {
		if (D > this.length) D = this.length - 1;
		if (D < 0) D = this.length + D;
		for (var B = 0, $ = this.head; $ !== null && B < D; B++) $ = $.next;
		var Z = [];
		for (var B = 0; $ && B < F; B++) Z.push($.value), ($ = this.removeNode($));
		if ($ === null) $ = this.tail;
		if ($ !== this.head && $ !== this.tail) $ = $.prev;
		for (var B = 0; B < _.length; B++) $ = wI(this, $, _[B]);
		return Z;
	};
	u.prototype.reverse = function () {
		var D = this.head,
			F = this.tail;
		for (var _ = D; _ !== null; _ = _.prev) {
			var B = _.prev;
			(_.prev = _.next), (_.next = B);
		}
		return (this.head = F), (this.tail = D), this;
	};
	function wI(D, F, _) {
		var B = F === D.head ? new _2(_, null, F, D) : new _2(_, F, F.next, D);
		if (B.next === null) D.tail = B;
		if (B.prev === null) D.head = B;
		return D.length++, B;
	}
	function jI(D, F) {
		if (((D.tail = new _2(F, D.tail, null, D)), !D.head)) D.head = D.tail;
		D.length++;
	}
	function uI(D, F) {
		if (((D.head = new _2(F, null, D.head, D)), !D.tail)) D.tail = D.head;
		D.length++;
	}
	function _2(D, F, _, B) {
		if (!(this instanceof _2)) return new _2(D, F, _, B);
		if (((this.list = B), (this.value = D), F))
			(F.next = this), (this.prev = F);
		else this.prev = null;
		if (_) (_.prev = this), (this.next = _);
		else this.next = null;
	}
	try {
		Jq()(u);
	} catch (D) {}
});
var S3 = W((Bj, Yq) => {
	class q9 {
		constructor(D, F) {
			(this.path = D || "./"),
				(this.absolute = F),
				(this.entry = null),
				(this.stat = null),
				(this.readdir = null),
				(this.pending = !1),
				(this.ignore = !1),
				(this.piped = !1);
		}
	}
	var { Minipass: NI } = J3(),
		Aq = b7(),
		SI = C3(),
		J9 = e7(),
		EI = J9.Sync,
		xI = J9.Tar,
		bI = D9(),
		Lq = Buffer.alloc(1024),
		O3 = Symbol("onStat"),
		P3 = Symbol("ended"),
		c0 = Symbol("queue"),
		S2 = Symbol("current"),
		B2 = Symbol("process"),
		T3 = Symbol("processing"),
		Gq = Symbol("processJob"),
		p0 = Symbol("jobs"),
		F9 = Symbol("jobDone"),
		w3 = Symbol("addFSEntry"),
		Vq = Symbol("addTarEntry"),
		Z9 = Symbol("stat"),
		X9 = Symbol("readdir"),
		j3 = Symbol("onreaddir"),
		u3 = Symbol("pipe"),
		Cq = Symbol("entry"),
		_9 = Symbol("entryOpt"),
		Q9 = Symbol("writeEntryClass"),
		Hq = Symbol("write"),
		B9 = Symbol("ondrain"),
		N3 = R("fs"),
		Wq = R("path"),
		gI = K3(),
		$9 = w2(),
		z9 = gI(
			class D extends NI {
				constructor(F) {
					super(F);
					if (
						((F = F || Object.create(null)),
						(this.opt = F),
						(this.file = F.file || ""),
						(this.cwd = F.cwd || process.cwd()),
						(this.maxReadSize = F.maxReadSize),
						(this.preservePaths = !!F.preservePaths),
						(this.strict = !!F.strict),
						(this.noPax = !!F.noPax),
						(this.prefix = $9(F.prefix || "")),
						(this.linkCache = F.linkCache || new Map()),
						(this.statCache = F.statCache || new Map()),
						(this.readdirCache = F.readdirCache || new Map()),
						(this[Q9] = J9),
						typeof F.onwarn === "function")
					)
						this.on("warn", F.onwarn);
					if (
						((this.portable = !!F.portable),
						(this.zip = null),
						F.gzip || F.brotli)
					) {
						if (F.gzip && F.brotli)
							throw new TypeError("gzip and brotli are mutually exclusive");
						if (F.gzip) {
							if (typeof F.gzip !== "object") F.gzip = {};
							if (this.portable) F.gzip.portable = !0;
							this.zip = new Aq.Gzip(F.gzip);
						}
						if (F.brotli) {
							if (typeof F.brotli !== "object") F.brotli = {};
							this.zip = new Aq.BrotliCompress(F.brotli);
						}
						this.zip.on("data", (_) => super.write(_)),
							this.zip.on("end", (_) => super.end()),
							this.zip.on("drain", (_) => this[B9]()),
							this.on("resume", (_) => this.zip.resume());
					} else this.on("drain", this[B9]);
					(this.noDirRecurse = !!F.noDirRecurse),
						(this.follow = !!F.follow),
						(this.noMtime = !!F.noMtime),
						(this.mtime = F.mtime || null),
						(this.filter =
							typeof F.filter === "function" ? F.filter : (_) => !0),
						(this[c0] = new bI()),
						(this[p0] = 0),
						(this.jobs = +F.jobs || 4),
						(this[T3] = !1),
						(this[P3] = !1);
				}
				[Hq](F) {
					return super.write(F);
				}
				add(F) {
					return this.write(F), this;
				}
				end(F) {
					if (F) this.write(F);
					return (this[P3] = !0), this[B2](), this;
				}
				write(F) {
					if (this[P3]) throw new Error("write after end");
					if (F instanceof SI) this[Vq](F);
					else this[w3](F);
					return this.flowing;
				}
				[Vq](F) {
					let _ = $9(Wq.resolve(this.cwd, F.path));
					if (!this.filter(F.path, F)) F.resume();
					else {
						let B = new q9(F.path, _, !1);
						(B.entry = new xI(F, this[_9](B))),
							B.entry.on("end", ($) => this[F9](B)),
							(this[p0] += 1),
							this[c0].push(B);
					}
					this[B2]();
				}
				[w3](F) {
					let _ = $9(Wq.resolve(this.cwd, F));
					this[c0].push(new q9(F, _)), this[B2]();
				}
				[Z9](F) {
					(F.pending = !0), (this[p0] += 1);
					let _ = this.follow ? "stat" : "lstat";
					N3[_](F.absolute, (B, $) => {
						if (((F.pending = !1), (this[p0] -= 1), B)) this.emit("error", B);
						else this[O3](F, $);
					});
				}
				[O3](F, _) {
					if (
						(this.statCache.set(F.absolute, _),
						(F.stat = _),
						!this.filter(F.path, _))
					)
						F.ignore = !0;
					this[B2]();
				}
				[X9](F) {
					(F.pending = !0),
						(this[p0] += 1),
						N3.readdir(F.absolute, (_, B) => {
							if (((F.pending = !1), (this[p0] -= 1), _))
								return this.emit("error", _);
							this[j3](F, B);
						});
				}
				[j3](F, _) {
					this.readdirCache.set(F.absolute, _), (F.readdir = _), this[B2]();
				}
				[B2]() {
					if (this[T3]) return;
					this[T3] = !0;
					for (
						let F = this[c0].head;
						F !== null && this[p0] < this.jobs;
						F = F.next
					)
						if ((this[Gq](F.value), F.value.ignore)) {
							let _ = F.next;
							this[c0].removeNode(F), (F.next = _);
						}
					if (((this[T3] = !1), this[P3] && !this[c0].length && this[p0] === 0))
						if (this.zip) this.zip.end(Lq);
						else super.write(Lq), super.end();
				}
				get [S2]() {
					return this[c0] && this[c0].head && this[c0].head.value;
				}
				[F9](F) {
					this[c0].shift(), (this[p0] -= 1), this[B2]();
				}
				[Gq](F) {
					if (F.pending) return;
					if (F.entry) {
						if (F === this[S2] && !F.piped) this[u3](F);
						return;
					}
					if (!F.stat)
						if (this.statCache.has(F.absolute))
							this[O3](F, this.statCache.get(F.absolute));
						else this[Z9](F);
					if (!F.stat) return;
					if (F.ignore) return;
					if (!this.noDirRecurse && F.stat.isDirectory() && !F.readdir) {
						if (this.readdirCache.has(F.absolute))
							this[j3](F, this.readdirCache.get(F.absolute));
						else this[X9](F);
						if (!F.readdir) return;
					}
					if (((F.entry = this[Cq](F)), !F.entry)) {
						F.ignore = !0;
						return;
					}
					if (F === this[S2] && !F.piped) this[u3](F);
				}
				[_9](F) {
					return {
						onwarn: (_, B, $) => this.warn(_, B, $),
						noPax: this.noPax,
						cwd: this.cwd,
						absolute: F.absolute,
						preservePaths: this.preservePaths,
						maxReadSize: this.maxReadSize,
						strict: this.strict,
						portable: this.portable,
						linkCache: this.linkCache,
						statCache: this.statCache,
						noMtime: this.noMtime,
						mtime: this.mtime,
						prefix: this.prefix,
					};
				}
				[Cq](F) {
					this[p0] += 1;
					try {
						return new this[Q9](F.path, this[_9](F))
							.on("end", () => this[F9](F))
							.on("error", (_) => this.emit("error", _));
					} catch (_) {
						this.emit("error", _);
					}
				}
				[B9]() {
					if (this[S2] && this[S2].entry) this[S2].entry.resume();
				}
				[u3](F) {
					if (((F.piped = !0), F.readdir))
						F.readdir.forEach(($) => {
							let Z = F.path,
								q = Z === "./" ? "" : Z.replace(/\/*$/, "/");
							this[w3](q + $);
						});
					let _ = F.entry,
						B = this.zip;
					if (B)
						_.on("data", ($) => {
							if (!B.write($)) _.pause();
						});
					else
						_.on("data", ($) => {
							if (!super.write($)) _.pause();
						});
				}
				pause() {
					if (this.zip) this.zip.pause();
					return super.pause();
				}
			},
		);
	class Kq extends z9 {
		constructor(D) {
			super(D);
			this[Q9] = EI;
		}
		pause() {}
		resume() {}
		[Z9](D) {
			let F = this.follow ? "statSync" : "lstatSync";
			this[O3](D, N3[F](D.absolute));
		}
		[X9](D, F) {
			this[j3](D, N3.readdirSync(D.absolute));
		}
		[u3](D) {
			let F = D.entry,
				_ = this.zip;
			if (D.readdir)
				D.readdir.forEach((B) => {
					let $ = D.path,
						Z = $ === "./" ? "" : $.replace(/\/*$/, "/");
					this[w3](Z + B);
				});
			if (_)
				F.on("data", (B) => {
					_.write(B);
				});
			else
				F.on("data", (B) => {
					super[Hq](B);
				});
		}
	}
	z9.Sync = Kq;
	Yq.exports = z9;
});
var uq = W(($j, jq) => {
	var Iq =
			typeof process === "object" && process
				? process
				: { stdout: null, stderr: null },
		vI = R("events"),
		Uq = R("stream"),
		Mq = R("string_decoder").StringDecoder,
		ZD = Symbol("EOF"),
		XD = Symbol("maybeEmitEnd"),
		xD = Symbol("emittedEnd"),
		E3 = Symbol("emittingEnd"),
		v1 = Symbol("emittedError"),
		x3 = Symbol("closed"),
		Rq = Symbol("read"),
		b3 = Symbol("flush"),
		Pq = Symbol("flushChunk"),
		A0 = Symbol("encoding"),
		QD = Symbol("decoder"),
		g3 = Symbol("flowing"),
		y1 = Symbol("paused"),
		E2 = Symbol("resume"),
		n = Symbol("bufferLength"),
		A9 = Symbol("bufferPush"),
		L9 = Symbol("bufferShift"),
		_0 = Symbol("objectMode"),
		B0 = Symbol("destroyed"),
		G9 = Symbol("emitData"),
		Tq = Symbol("emitEnd"),
		V9 = Symbol("emitEnd2"),
		JD = Symbol("async"),
		k1 = (D) => Promise.resolve().then(D),
		Oq = global._MP_NO_ITERATOR_SYMBOLS_ !== "1",
		yI =
			(Oq && Symbol.asyncIterator) || Symbol("asyncIterator not implemented"),
		kI = (Oq && Symbol.iterator) || Symbol("iterator not implemented"),
		fI = (D) => D === "end" || D === "finish" || D === "prefinish",
		mI = (D) =>
			D instanceof ArrayBuffer ||
			(typeof D === "object" &&
				D.constructor &&
				D.constructor.name === "ArrayBuffer" &&
				D.byteLength >= 0),
		hI = (D) => !Buffer.isBuffer(D) && ArrayBuffer.isView(D);
	class C9 {
		constructor(D, F, _) {
			(this.src = D),
				(this.dest = F),
				(this.opts = _),
				(this.ondrain = () => D[E2]()),
				F.on("drain", this.ondrain);
		}
		unpipe() {
			this.dest.removeListener("drain", this.ondrain);
		}
		proxyErrors() {}
		end() {
			if ((this.unpipe(), this.opts.end)) this.dest.end();
		}
	}
	class wq extends C9 {
		unpipe() {
			this.src.removeListener("error", this.proxyErrors), super.unpipe();
		}
		constructor(D, F, _) {
			super(D, F, _);
			(this.proxyErrors = (B) => F.emit("error", B)),
				D.on("error", this.proxyErrors);
		}
	}
	jq.exports = class D extends Uq {
		constructor(F) {
			super();
			if (
				((this[g3] = !1),
				(this[y1] = !1),
				(this.pipes = []),
				(this.buffer = []),
				(this[_0] = (F && F.objectMode) || !1),
				this[_0])
			)
				this[A0] = null;
			else this[A0] = (F && F.encoding) || null;
			if (this[A0] === "buffer") this[A0] = null;
			(this[JD] = (F && !!F.async) || !1),
				(this[QD] = this[A0] ? new Mq(this[A0]) : null),
				(this[ZD] = !1),
				(this[xD] = !1),
				(this[E3] = !1),
				(this[x3] = !1),
				(this[v1] = null),
				(this.writable = !0),
				(this.readable = !0),
				(this[n] = 0),
				(this[B0] = !1);
		}
		get bufferLength() {
			return this[n];
		}
		get encoding() {
			return this[A0];
		}
		set encoding(F) {
			if (this[_0]) throw new Error("cannot set encoding in objectMode");
			if (
				this[A0] &&
				F !== this[A0] &&
				((this[QD] && this[QD].lastNeed) || this[n])
			)
				throw new Error("cannot change encoding");
			if (this[A0] !== F) {
				if (((this[QD] = F ? new Mq(F) : null), this.buffer.length))
					this.buffer = this.buffer.map((_) => this[QD].write(_));
			}
			this[A0] = F;
		}
		setEncoding(F) {
			this.encoding = F;
		}
		get objectMode() {
			return this[_0];
		}
		set objectMode(F) {
			this[_0] = this[_0] || !!F;
		}
		get ["async"]() {
			return this[JD];
		}
		set ["async"](F) {
			this[JD] = this[JD] || !!F;
		}
		write(F, _, B) {
			if (this[ZD]) throw new Error("write after end");
			if (this[B0])
				return (
					this.emit(
						"error",
						Object.assign(
							new Error("Cannot call write after a stream was destroyed"),
							{ code: "ERR_STREAM_DESTROYED" },
						),
					),
					!0
				);
			if (typeof _ === "function") (B = _), (_ = "utf8");
			if (!_) _ = "utf8";
			let $ = this[JD] ? k1 : (Z) => Z();
			if (!this[_0] && !Buffer.isBuffer(F)) {
				if (hI(F)) F = Buffer.from(F.buffer, F.byteOffset, F.byteLength);
				else if (mI(F)) F = Buffer.from(F);
				else if (typeof F !== "string") this.objectMode = !0;
			}
			if (this[_0]) {
				if (this.flowing && this[n] !== 0) this[b3](!0);
				if (this.flowing) this.emit("data", F);
				else this[A9](F);
				if (this[n] !== 0) this.emit("readable");
				if (B) $(B);
				return this.flowing;
			}
			if (!F.length) {
				if (this[n] !== 0) this.emit("readable");
				if (B) $(B);
				return this.flowing;
			}
			if (typeof F === "string" && !(_ === this[A0] && !this[QD].lastNeed))
				F = Buffer.from(F, _);
			if (Buffer.isBuffer(F) && this[A0]) F = this[QD].write(F);
			if (this.flowing && this[n] !== 0) this[b3](!0);
			if (this.flowing) this.emit("data", F);
			else this[A9](F);
			if (this[n] !== 0) this.emit("readable");
			if (B) $(B);
			return this.flowing;
		}
		read(F) {
			if (this[B0]) return null;
			if (this[n] === 0 || F === 0 || F > this[n]) return this[XD](), null;
			if (this[_0]) F = null;
			if (this.buffer.length > 1 && !this[_0])
				if (this.encoding) this.buffer = [this.buffer.join("")];
				else this.buffer = [Buffer.concat(this.buffer, this[n])];
			let _ = this[Rq](F || null, this.buffer[0]);
			return this[XD](), _;
		}
		[Rq](F, _) {
			if (F === _.length || F === null) this[L9]();
			else (this.buffer[0] = _.slice(F)), (_ = _.slice(0, F)), (this[n] -= F);
			if ((this.emit("data", _), !this.buffer.length && !this[ZD]))
				this.emit("drain");
			return _;
		}
		end(F, _, B) {
			if (typeof F === "function") (B = F), (F = null);
			if (typeof _ === "function") (B = _), (_ = "utf8");
			if (F) this.write(F, _);
			if (B) this.once("end", B);
			if (((this[ZD] = !0), (this.writable = !1), this.flowing || !this[y1]))
				this[XD]();
			return this;
		}
		[E2]() {
			if (this[B0]) return;
			if (
				((this[y1] = !1),
				(this[g3] = !0),
				this.emit("resume"),
				this.buffer.length)
			)
				this[b3]();
			else if (this[ZD]) this[XD]();
			else this.emit("drain");
		}
		resume() {
			return this[E2]();
		}
		pause() {
			(this[g3] = !1), (this[y1] = !0);
		}
		get destroyed() {
			return this[B0];
		}
		get flowing() {
			return this[g3];
		}
		get paused() {
			return this[y1];
		}
		[A9](F) {
			if (this[_0]) this[n] += 1;
			else this[n] += F.length;
			this.buffer.push(F);
		}
		[L9]() {
			if (this.buffer.length)
				if (this[_0]) this[n] -= 1;
				else this[n] -= this.buffer[0].length;
			return this.buffer.shift();
		}
		[b3](F) {
			do;
			while (this[Pq](this[L9]()));
			if (!F && !this.buffer.length && !this[ZD]) this.emit("drain");
		}
		[Pq](F) {
			return F ? (this.emit("data", F), this.flowing) : !1;
		}
		pipe(F, _) {
			if (this[B0]) return;
			let B = this[xD];
			if (((_ = _ || {}), F === Iq.stdout || F === Iq.stderr)) _.end = !1;
			else _.end = _.end !== !1;
			if (((_.proxyErrors = !!_.proxyErrors), B)) {
				if (_.end) F.end();
			} else if (
				(this.pipes.push(
					!_.proxyErrors ? new C9(this, F, _) : new wq(this, F, _),
				),
				this[JD])
			)
				k1(() => this[E2]());
			else this[E2]();
			return F;
		}
		unpipe(F) {
			let _ = this.pipes.find((B) => B.dest === F);
			if (_) this.pipes.splice(this.pipes.indexOf(_), 1), _.unpipe();
		}
		addListener(F, _) {
			return this.on(F, _);
		}
		on(F, _) {
			let B = super.on(F, _);
			if (F === "data" && !this.pipes.length && !this.flowing) this[E2]();
			else if (F === "readable" && this[n] !== 0) super.emit("readable");
			else if (fI(F) && this[xD]) super.emit(F), this.removeAllListeners(F);
			else if (F === "error" && this[v1])
				if (this[JD]) k1(() => _.call(this, this[v1]));
				else _.call(this, this[v1]);
			return B;
		}
		get emittedEnd() {
			return this[xD];
		}
		[XD]() {
			if (
				!this[E3] &&
				!this[xD] &&
				!this[B0] &&
				this.buffer.length === 0 &&
				this[ZD]
			) {
				if (
					((this[E3] = !0),
					this.emit("end"),
					this.emit("prefinish"),
					this.emit("finish"),
					this[x3])
				)
					this.emit("close");
				this[E3] = !1;
			}
		}
		emit(F, _, ...B) {
			if (F !== "error" && F !== "close" && F !== B0 && this[B0]) return;
			else if (F === "data")
				return !_ ? !1 : this[JD] ? k1(() => this[G9](_)) : this[G9](_);
			else if (F === "end") return this[Tq]();
			else if (F === "close") {
				if (((this[x3] = !0), !this[xD] && !this[B0])) return;
				let Z = super.emit("close");
				return this.removeAllListeners("close"), Z;
			} else if (F === "error") {
				this[v1] = _;
				let Z = super.emit("error", _);
				return this[XD](), Z;
			} else if (F === "resume") {
				let Z = super.emit("resume");
				return this[XD](), Z;
			} else if (F === "finish" || F === "prefinish") {
				let Z = super.emit(F);
				return this.removeAllListeners(F), Z;
			}
			let $ = super.emit(F, _, ...B);
			return this[XD](), $;
		}
		[G9](F) {
			for (let B of this.pipes) if (B.dest.write(F) === !1) this.pause();
			let _ = super.emit("data", F);
			return this[XD](), _;
		}
		[Tq]() {
			if (this[xD]) return;
			if (((this[xD] = !0), (this.readable = !1), this[JD]))
				k1(() => this[V9]());
			else this[V9]();
		}
		[V9]() {
			if (this[QD]) {
				let _ = this[QD].end();
				if (_) {
					for (let B of this.pipes) B.dest.write(_);
					super.emit("data", _);
				}
			}
			for (let _ of this.pipes) _.end();
			let F = super.emit("end");
			return this.removeAllListeners("end"), F;
		}
		collect() {
			let F = [];
			if (!this[_0]) F.dataLength = 0;
			let _ = this.promise();
			return (
				this.on("data", (B) => {
					if ((F.push(B), !this[_0])) F.dataLength += B.length;
				}),
				_.then(() => F)
			);
		}
		concat() {
			return this[_0]
				? Promise.reject(new Error("cannot concat in objectMode"))
				: this.collect().then((F) =>
						this[_0]
							? Promise.reject(new Error("cannot concat in objectMode"))
							: this[A0]
								? F.join("")
								: Buffer.concat(F, F.dataLength),
					);
		}
		promise() {
			return new Promise((F, _) => {
				this.on(B0, () => _(new Error("stream destroyed"))),
					this.on("error", (B) => _(B)),
					this.on("end", () => F());
			});
		}
		[yI]() {
			return {
				next: () => {
					let _ = this.read();
					if (_ !== null) return Promise.resolve({ done: !1, value: _ });
					if (this[ZD]) return Promise.resolve({ done: !0 });
					let B = null,
						$ = null,
						Z = (J) => {
							this.removeListener("data", q),
								this.removeListener("end", X),
								$(J);
						},
						q = (J) => {
							this.removeListener("error", Z),
								this.removeListener("end", X),
								this.pause(),
								B({ value: J, done: !!this[ZD] });
						},
						X = () => {
							this.removeListener("error", Z),
								this.removeListener("data", q),
								B({ done: !0 });
						},
						Q = () => Z(new Error("stream destroyed"));
					return new Promise((J, z) => {
						($ = z),
							(B = J),
							this.once(B0, Q),
							this.once("error", Z),
							this.once("end", X),
							this.once("data", q);
					});
				},
			};
		}
		[kI]() {
			return {
				next: () => {
					let _ = this.read();
					return { value: _, done: _ === null };
				},
			};
		}
		destroy(F) {
			if (this[B0]) {
				if (F) this.emit("error", F);
				else this.emit(B0);
				return this;
			}
			if (
				((this[B0] = !0),
				(this.buffer.length = 0),
				(this[n] = 0),
				typeof this.close === "function" && !this[x3])
			)
				this.close();
			if (F) this.emit("error", F);
			else this.emit(B0);
			return this;
		}
		static isStream(F) {
			return (
				!!F &&
				(F instanceof D ||
					F instanceof Uq ||
					(F instanceof vI &&
						(typeof F.pipe === "function" ||
							(typeof F.write === "function" && typeof F.end === "function"))))
			);
		}
	};
});
var m2 = W((cI) => {
	var lI = uq(),
		dI = R("events").EventEmitter,
		L0 = R("fs"),
		K9 = L0.writev;
	if (!K9) {
		let D = process.binding("fs"),
			F = D.FSReqWrap || D.FSReqCallback;
		K9 = (_, B, $, Z) => {
			let q = (Q, J) => Z(Q, J, B),
				X = new F();
			(X.oncomplete = q), D.writeBuffers(_, B, $, X);
		};
	}
	var k2 = Symbol("_autoClose"),
		N0 = Symbol("_close"),
		f1 = Symbol("_ended"),
		b = Symbol("_fd"),
		Nq = Symbol("_finished"),
		gD = Symbol("_flags"),
		W9 = Symbol("_flush"),
		Y9 = Symbol("_handleChunk"),
		I9 = Symbol("_makeBuf"),
		m3 = Symbol("_mode"),
		v3 = Symbol("_needDrain"),
		v2 = Symbol("_onerror"),
		f2 = Symbol("_onopen"),
		H9 = Symbol("_onread"),
		b2 = Symbol("_onwrite"),
		vD = Symbol("_open"),
		zD = Symbol("_path"),
		$2 = Symbol("_pos"),
		a0 = Symbol("_queue"),
		g2 = Symbol("_read"),
		Sq = Symbol("_readSize"),
		bD = Symbol("_reading"),
		y3 = Symbol("_remain"),
		Eq = Symbol("_size"),
		k3 = Symbol("_write"),
		x2 = Symbol("_writing"),
		f3 = Symbol("_defaultFlag"),
		y2 = Symbol("_errored");
	class U9 extends lI {
		constructor(D, F) {
			F = F || {};
			super(F);
			if (((this.readable = !0), (this.writable = !1), typeof D !== "string"))
				throw new TypeError("path must be a string");
			if (
				((this[y2] = !1),
				(this[b] = typeof F.fd === "number" ? F.fd : null),
				(this[zD] = D),
				(this[Sq] = F.readSize || 16777216),
				(this[bD] = !1),
				(this[Eq] = typeof F.size === "number" ? F.size : 1 / 0),
				(this[y3] = this[Eq]),
				(this[k2] = typeof F.autoClose === "boolean" ? F.autoClose : !0),
				typeof this[b] === "number")
			)
				this[g2]();
			else this[vD]();
		}
		get fd() {
			return this[b];
		}
		get path() {
			return this[zD];
		}
		write() {
			throw new TypeError("this is a readable stream");
		}
		end() {
			throw new TypeError("this is a readable stream");
		}
		[vD]() {
			L0.open(this[zD], "r", (D, F) => this[f2](D, F));
		}
		[f2](D, F) {
			if (D) this[v2](D);
			else (this[b] = F), this.emit("open", F), this[g2]();
		}
		[I9]() {
			return Buffer.allocUnsafe(Math.min(this[Sq], this[y3]));
		}
		[g2]() {
			if (!this[bD]) {
				this[bD] = !0;
				let D = this[I9]();
				if (D.length === 0) return process.nextTick(() => this[H9](null, 0, D));
				L0.read(this[b], D, 0, D.length, null, (F, _, B) => this[H9](F, _, B));
			}
		}
		[H9](D, F, _) {
			if (((this[bD] = !1), D)) this[v2](D);
			else if (this[Y9](F, _)) this[g2]();
		}
		[N0]() {
			if (this[k2] && typeof this[b] === "number") {
				let D = this[b];
				(this[b] = null),
					L0.close(D, (F) => (F ? this.emit("error", F) : this.emit("close")));
			}
		}
		[v2](D) {
			(this[bD] = !0), this[N0](), this.emit("error", D);
		}
		[Y9](D, F) {
			let _ = !1;
			if (((this[y3] -= D), D > 0))
				_ = super.write(D < F.length ? F.slice(0, D) : F);
			if (D === 0 || this[y3] <= 0) (_ = !1), this[N0](), super.end();
			return _;
		}
		emit(D, F) {
			switch (D) {
				case "prefinish":
				case "finish":
					break;
				case "drain":
					if (typeof this[b] === "number") this[g2]();
					break;
				case "error":
					if (this[y2]) return;
					return (this[y2] = !0), super.emit(D, F);
				default:
					return super.emit(D, F);
			}
		}
	}
	class xq extends U9 {
		[vD]() {
			let D = !0;
			try {
				this[f2](null, L0.openSync(this[zD], "r")), (D = !1);
			} finally {
				if (D) this[N0]();
			}
		}
		[g2]() {
			let D = !0;
			try {
				if (!this[bD]) {
					this[bD] = !0;
					do {
						let F = this[I9](),
							_ =
								F.length === 0 ? 0 : L0.readSync(this[b], F, 0, F.length, null);
						if (!this[Y9](_, F)) break;
					} while (!0);
					this[bD] = !1;
				}
				D = !1;
			} finally {
				if (D) this[N0]();
			}
		}
		[N0]() {
			if (this[k2] && typeof this[b] === "number") {
				let D = this[b];
				(this[b] = null), L0.closeSync(D), this.emit("close");
			}
		}
	}
	class M9 extends dI {
		constructor(D, F) {
			F = F || {};
			super(F);
			(this.readable = !1),
				(this.writable = !0),
				(this[y2] = !1),
				(this[x2] = !1),
				(this[f1] = !1),
				(this[v3] = !1),
				(this[a0] = []),
				(this[zD] = D),
				(this[b] = typeof F.fd === "number" ? F.fd : null),
				(this[m3] = F.mode === void 0 ? 438 : F.mode),
				(this[$2] = typeof F.start === "number" ? F.start : null),
				(this[k2] = typeof F.autoClose === "boolean" ? F.autoClose : !0);
			let _ = this[$2] !== null ? "r+" : "w";
			if (
				((this[f3] = F.flags === void 0),
				(this[gD] = this[f3] ? _ : F.flags),
				this[b] === null)
			)
				this[vD]();
		}
		emit(D, F) {
			if (D === "error") {
				if (this[y2]) return;
				this[y2] = !0;
			}
			return super.emit(D, F);
		}
		get fd() {
			return this[b];
		}
		get path() {
			return this[zD];
		}
		[v2](D) {
			this[N0](), (this[x2] = !0), this.emit("error", D);
		}
		[vD]() {
			L0.open(this[zD], this[gD], this[m3], (D, F) => this[f2](D, F));
		}
		[f2](D, F) {
			if (this[f3] && this[gD] === "r+" && D && D.code === "ENOENT")
				(this[gD] = "w"), this[vD]();
			else if (D) this[v2](D);
			else (this[b] = F), this.emit("open", F), this[W9]();
		}
		end(D, F) {
			if (D) this.write(D, F);
			if (
				((this[f1] = !0),
				!this[x2] && !this[a0].length && typeof this[b] === "number")
			)
				this[b2](null, 0);
			return this;
		}
		write(D, F) {
			if (typeof D === "string") D = Buffer.from(D, F);
			if (this[f1])
				return this.emit("error", new Error("write() after end()")), !1;
			if (this[b] === null || this[x2] || this[a0].length)
				return this[a0].push(D), (this[v3] = !0), !1;
			return (this[x2] = !0), this[k3](D), !0;
		}
		[k3](D) {
			L0.write(this[b], D, 0, D.length, this[$2], (F, _) => this[b2](F, _));
		}
		[b2](D, F) {
			if (D) this[v2](D);
			else {
				if (this[$2] !== null) this[$2] += F;
				if (this[a0].length) this[W9]();
				else if (((this[x2] = !1), this[f1] && !this[Nq]))
					(this[Nq] = !0), this[N0](), this.emit("finish");
				else if (this[v3]) (this[v3] = !1), this.emit("drain");
			}
		}
		[W9]() {
			if (this[a0].length === 0) {
				if (this[f1]) this[b2](null, 0);
			} else if (this[a0].length === 1) this[k3](this[a0].pop());
			else {
				let D = this[a0];
				(this[a0] = []), K9(this[b], D, this[$2], (F, _) => this[b2](F, _));
			}
		}
		[N0]() {
			if (this[k2] && typeof this[b] === "number") {
				let D = this[b];
				(this[b] = null),
					L0.close(D, (F) => (F ? this.emit("error", F) : this.emit("close")));
			}
		}
	}
	class bq extends M9 {
		[vD]() {
			let D;
			if (this[f3] && this[gD] === "r+")
				try {
					D = L0.openSync(this[zD], this[gD], this[m3]);
				} catch (F) {
					if (F.code === "ENOENT") return (this[gD] = "w"), this[vD]();
					else throw F;
				}
			else D = L0.openSync(this[zD], this[gD], this[m3]);
			this[f2](null, D);
		}
		[N0]() {
			if (this[k2] && typeof this[b] === "number") {
				let D = this[b];
				(this[b] = null), L0.closeSync(D), this.emit("close");
			}
		}
		[k3](D) {
			let F = !0;
			try {
				this[b2](null, L0.writeSync(this[b], D, 0, D.length, this[$2])),
					(F = !1);
			} finally {
				if (F)
					try {
						this[N0]();
					} catch (_) {}
			}
		}
	}
	cI.ReadStream = U9;
	cI.ReadStreamSync = xq;
	cI.WriteStream = M9;
	cI.WriteStreamSync = bq;
});
var i3 = W((Zj, cq) => {
	var rI = K3(),
		gq = u2(),
		nI = R("events"),
		oI = D9(),
		tI = C3(),
		vq = H3(),
		yq = b7(),
		{ nextTick: eI } = R("process"),
		R9 = Buffer.from([31, 139]),
		I0 = Symbol("state"),
		q2 = Symbol("writeEntry"),
		AD = Symbol("readEntry"),
		P9 = Symbol("nextEntry"),
		kq = Symbol("processEntry"),
		U0 = Symbol("extendedHeader"),
		m1 = Symbol("globalExtendedHeader"),
		yD = Symbol("meta"),
		fq = Symbol("emitMeta"),
		v = Symbol("buffer"),
		LD = Symbol("queue"),
		kD = Symbol("ended"),
		mq = Symbol("emittedEnd"),
		Z2 = Symbol("emit"),
		o = Symbol("unzip"),
		h3 = Symbol("consumeChunk"),
		l3 = Symbol("consumeChunkSub"),
		T9 = Symbol("consumeBody"),
		hq = Symbol("consumeMeta"),
		lq = Symbol("consumeHeader"),
		d3 = Symbol("consuming"),
		O9 = Symbol("bufferConcat"),
		w9 = Symbol("maybeEnd"),
		h1 = Symbol("writing"),
		fD = Symbol("aborted"),
		c3 = Symbol("onDone"),
		X2 = Symbol("sawValidEntry"),
		p3 = Symbol("sawNullBlock"),
		a3 = Symbol("sawEOF"),
		dq = Symbol("closeStream"),
		DU = (D) => !0;
	cq.exports = rI(
		class D extends nI {
			constructor(F) {
				F = F || {};
				super(F);
				if (
					((this.file = F.file || ""),
					(this[X2] = null),
					this.on(c3, (B) => {
						if (this[I0] === "begin" || this[X2] === !1)
							this.warn("TAR_BAD_ARCHIVE", "Unrecognized archive format");
					}),
					F.ondone)
				)
					this.on(c3, F.ondone);
				else
					this.on(c3, (B) => {
						this.emit("prefinish"), this.emit("finish"), this.emit("end");
					});
				(this.strict = !!F.strict),
					(this.maxMetaEntrySize = F.maxMetaEntrySize || 1048576),
					(this.filter = typeof F.filter === "function" ? F.filter : DU);
				let _ =
					F.file && (F.file.endsWith(".tar.br") || F.file.endsWith(".tbr"));
				if (
					((this.brotli =
						!F.gzip && F.brotli !== void 0 ? F.brotli : _ ? void 0 : !1),
					(this.writable = !0),
					(this.readable = !1),
					(this[LD] = new oI()),
					(this[v] = null),
					(this[AD] = null),
					(this[q2] = null),
					(this[I0] = "begin"),
					(this[yD] = ""),
					(this[U0] = null),
					(this[m1] = null),
					(this[kD] = !1),
					(this[o] = null),
					(this[fD] = !1),
					(this[p3] = !1),
					(this[a3] = !1),
					this.on("end", () => this[dq]()),
					typeof F.onwarn === "function")
				)
					this.on("warn", F.onwarn);
				if (typeof F.onentry === "function") this.on("entry", F.onentry);
			}
			[lq](F, _) {
				if (this[X2] === null) this[X2] = !1;
				let B;
				try {
					B = new gq(F, _, this[U0], this[m1]);
				} catch ($) {
					return this.warn("TAR_ENTRY_INVALID", $);
				}
				if (B.nullBlock)
					if (this[p3]) {
						if (((this[a3] = !0), this[I0] === "begin")) this[I0] = "header";
						this[Z2]("eof");
					} else (this[p3] = !0), this[Z2]("nullBlock");
				else if (((this[p3] = !1), !B.cksumValid))
					this.warn("TAR_ENTRY_INVALID", "checksum failure", { header: B });
				else if (!B.path)
					this.warn("TAR_ENTRY_INVALID", "path is required", { header: B });
				else {
					let $ = B.type;
					if (/^(Symbolic)?Link$/.test($) && !B.linkpath)
						this.warn("TAR_ENTRY_INVALID", "linkpath required", { header: B });
					else if (!/^(Symbolic)?Link$/.test($) && B.linkpath)
						this.warn("TAR_ENTRY_INVALID", "linkpath forbidden", { header: B });
					else {
						let Z = (this[q2] = new tI(B, this[U0], this[m1]));
						if (!this[X2])
							if (Z.remain) {
								let q = () => {
									if (!Z.invalid) this[X2] = !0;
								};
								Z.on("end", q);
							} else this[X2] = !0;
						if (Z.meta) {
							if (Z.size > this.maxMetaEntrySize)
								(Z.ignore = !0),
									this[Z2]("ignoredEntry", Z),
									(this[I0] = "ignore"),
									Z.resume();
							else if (Z.size > 0)
								(this[yD] = ""),
									Z.on("data", (q) => (this[yD] += q)),
									(this[I0] = "meta");
						} else if (
							((this[U0] = null),
							(Z.ignore = Z.ignore || !this.filter(Z.path, Z)),
							Z.ignore)
						)
							this[Z2]("ignoredEntry", Z),
								(this[I0] = Z.remain ? "ignore" : "header"),
								Z.resume();
						else {
							if (Z.remain) this[I0] = "body";
							else (this[I0] = "header"), Z.end();
							if (!this[AD]) this[LD].push(Z), this[P9]();
							else this[LD].push(Z);
						}
					}
				}
			}
			[dq]() {
				eI(() => this.emit("close"));
			}
			[kq](F) {
				let _ = !0;
				if (!F) (this[AD] = null), (_ = !1);
				else if (Array.isArray(F)) this.emit.apply(this, F);
				else if (((this[AD] = F), this.emit("entry", F), !F.emittedEnd))
					F.on("end", (B) => this[P9]()), (_ = !1);
				return _;
			}
			[P9]() {
				do;
				while (this[kq](this[LD].shift()));
				if (!this[LD].length) {
					let F = this[AD];
					if (!F || F.flowing || F.size === F.remain) {
						if (!this[h1]) this.emit("drain");
					} else F.once("drain", (B) => this.emit("drain"));
				}
			}
			[T9](F, _) {
				let B = this[q2],
					$ = B.blockRemain,
					Z = $ >= F.length && _ === 0 ? F : F.slice(_, _ + $);
				if ((B.write(Z), !B.blockRemain))
					(this[I0] = "header"), (this[q2] = null), B.end();
				return Z.length;
			}
			[hq](F, _) {
				let B = this[q2],
					$ = this[T9](F, _);
				if (!this[q2]) this[fq](B);
				return $;
			}
			[Z2](F, _, B) {
				if (!this[LD].length && !this[AD]) this.emit(F, _, B);
				else this[LD].push([F, _, B]);
			}
			[fq](F) {
				switch ((this[Z2]("meta", this[yD]), F.type)) {
					case "ExtendedHeader":
					case "OldExtendedHeader":
						this[U0] = vq.parse(this[yD], this[U0], !1);
						break;
					case "GlobalExtendedHeader":
						this[m1] = vq.parse(this[yD], this[m1], !0);
						break;
					case "NextFileHasLongPath":
					case "OldGnuLongPath":
						(this[U0] = this[U0] || Object.create(null)),
							(this[U0].path = this[yD].replace(/\0.*/, ""));
						break;
					case "NextFileHasLongLinkpath":
						(this[U0] = this[U0] || Object.create(null)),
							(this[U0].linkpath = this[yD].replace(/\0.*/, ""));
						break;
					default:
						throw new Error("unknown meta: " + F.type);
				}
			}
			abort(F) {
				(this[fD] = !0),
					this.emit("abort", F),
					this.warn("TAR_ABORT", F, { recoverable: !1 });
			}
			write(F) {
				if (this[fD]) return;
				if (
					(this[o] === null || (this.brotli === void 0 && this[o] === !1)) &&
					F
				) {
					if (this[v]) (F = Buffer.concat([this[v], F])), (this[v] = null);
					if (F.length < R9.length) return (this[v] = F), !0;
					for (let Z = 0; this[o] === null && Z < R9.length; Z++)
						if (F[Z] !== R9[Z]) this[o] = !1;
					let $ = this.brotli === void 0;
					if (this[o] === !1 && $)
						if (F.length < 512)
							if (this[kD]) this.brotli = !0;
							else return (this[v] = F), !0;
						else
							try {
								new gq(F.slice(0, 512)), (this.brotli = !1);
							} catch (Z) {
								this.brotli = !0;
							}
					if (this[o] === null || (this[o] === !1 && this.brotli)) {
						let Z = this[kD];
						(this[kD] = !1),
							(this[o] =
								this[o] === null ? new yq.Unzip() : new yq.BrotliDecompress()),
							this[o].on("data", (X) => this[h3](X)),
							this[o].on("error", (X) => this.abort(X)),
							this[o].on("end", (X) => {
								(this[kD] = !0), this[h3]();
							}),
							(this[h1] = !0);
						let q = this[o][Z ? "end" : "write"](F);
						return (this[h1] = !1), q;
					}
				}
				if (((this[h1] = !0), this[o])) this[o].write(F);
				else this[h3](F);
				this[h1] = !1;
				let B = this[LD].length ? !1 : this[AD] ? this[AD].flowing : !0;
				if (!B && !this[LD].length)
					this[AD].once("drain", ($) => this.emit("drain"));
				return B;
			}
			[O9](F) {
				if (F && !this[fD]) this[v] = this[v] ? Buffer.concat([this[v], F]) : F;
			}
			[w9]() {
				if (this[kD] && !this[mq] && !this[fD] && !this[d3]) {
					this[mq] = !0;
					let F = this[q2];
					if (F && F.blockRemain) {
						let _ = this[v] ? this[v].length : 0;
						if (
							(this.warn(
								"TAR_BAD_ARCHIVE",
								`Truncated input (needed ${F.blockRemain} more bytes, only ${_} available)`,
								{ entry: F },
							),
							this[v])
						)
							F.write(this[v]);
						F.end();
					}
					this[Z2](c3);
				}
			}
			[h3](F) {
				if (this[d3]) this[O9](F);
				else if (!F && !this[v]) this[w9]();
				else {
					if (((this[d3] = !0), this[v])) {
						this[O9](F);
						let _ = this[v];
						(this[v] = null), this[l3](_);
					} else this[l3](F);
					while (this[v] && this[v].length >= 512 && !this[fD] && !this[a3]) {
						let _ = this[v];
						(this[v] = null), this[l3](_);
					}
					this[d3] = !1;
				}
				if (!this[v] || this[kD]) this[w9]();
			}
			[l3](F) {
				let _ = 0,
					B = F.length;
				while (_ + 512 <= B && !this[fD] && !this[a3])
					switch (this[I0]) {
						case "begin":
						case "header":
							this[lq](F, _), (_ += 512);
							break;
						case "ignore":
						case "body":
							_ += this[T9](F, _);
							break;
						case "meta":
							_ += this[hq](F, _);
							break;
						default:
							throw new Error("invalid state: " + this[I0]);
					}
				if (_ < B)
					if (this[v]) this[v] = Buffer.concat([F.slice(_), this[v]]);
					else this[v] = F.slice(_);
			}
			end(F) {
				if (!this[fD])
					if (this[o]) this[o].end(F);
					else {
						if (((this[kD] = !0), this.brotli === void 0))
							F = F || Buffer.alloc(0);
						this.write(F);
					}
			}
		},
	);
});
var s3 = W((Xj, sq) => {
	var FU = R2(),
		aq = i3(),
		h2 = R("fs"),
		_U = m2(),
		pq = R("path"),
		j9 = N2();
	sq.exports = (D, F, _) => {
		if (typeof D === "function") (_ = D), (F = null), (D = {});
		else if (Array.isArray(D)) (F = D), (D = {});
		if (typeof F === "function") (_ = F), (F = null);
		if (!F) F = [];
		else F = Array.from(F);
		let B = FU(D);
		if (B.sync && typeof _ === "function")
			throw new TypeError("callback not supported for sync tar functions");
		if (!B.file && typeof _ === "function")
			throw new TypeError("callback only supported with file option");
		if (F.length) $U(B, F);
		if (!B.noResume) BU(B);
		return B.file && B.sync ? qU(B) : B.file ? ZU(B, _) : iq(B);
	};
	var BU = (D) => {
			let F = D.onentry;
			D.onentry = F
				? (_) => {
						F(_), _.resume();
					}
				: (_) => _.resume();
		},
		$U = (D, F) => {
			let _ = new Map(F.map((Z) => [j9(Z), !0])),
				B = D.filter,
				$ = (Z, q) => {
					let X = q || pq.parse(Z).root || ".",
						Q = Z === X ? !1 : _.has(Z) ? _.get(Z) : $(pq.dirname(Z), X);
					return _.set(Z, Q), Q;
				};
			D.filter = B ? (Z, q) => B(Z, q) && $(j9(Z)) : (Z) => $(j9(Z));
		},
		qU = (D) => {
			let F = iq(D),
				_ = D.file,
				B = !0,
				$;
			try {
				let Z = h2.statSync(_),
					q = D.maxReadSize || 16777216;
				if (Z.size < q) F.end(h2.readFileSync(_));
				else {
					let X = 0,
						Q = Buffer.allocUnsafe(q);
					$ = h2.openSync(_, "r");
					while (X < Z.size) {
						let J = h2.readSync($, Q, 0, q, X);
						(X += J), F.write(Q.slice(0, J));
					}
					F.end();
				}
				B = !1;
			} finally {
				if (B && $)
					try {
						h2.closeSync($);
					} catch (Z) {}
			}
		},
		ZU = (D, F) => {
			let _ = new aq(D),
				B = D.maxReadSize || 16777216,
				$ = D.file,
				Z = new Promise((q, X) => {
					_.on("error", X),
						_.on("end", q),
						h2.stat($, (Q, J) => {
							if (Q) X(Q);
							else {
								let z = new _U.ReadStream($, { readSize: B, size: J.size });
								z.on("error", X), z.pipe(_);
							}
						});
				});
			return F ? Z.then(F, F) : Z;
		},
		iq = (D) => new aq(D);
});
var DZ = W((Qj, eq) => {
	var XU = R2(),
		r3 = S3(),
		rq = m2(),
		nq = s3(),
		oq = R("path");
	eq.exports = (D, F, _) => {
		if (typeof F === "function") _ = F;
		if (Array.isArray(D)) (F = D), (D = {});
		if (!F || !Array.isArray(F) || !F.length)
			throw new TypeError("no files or directories specified");
		F = Array.from(F);
		let B = XU(D);
		if (B.sync && typeof _ === "function")
			throw new TypeError("callback not supported for sync tar functions");
		if (!B.file && typeof _ === "function")
			throw new TypeError("callback only supported with file option");
		return B.file && B.sync
			? QU(B, F)
			: B.file
				? JU(B, F, _)
				: B.sync
					? zU(B, F)
					: AU(B, F);
	};
	var QU = (D, F) => {
			let _ = new r3.Sync(D),
				B = new rq.WriteStreamSync(D.file, { mode: D.mode || 438 });
			_.pipe(B), tq(_, F);
		},
		JU = (D, F, _) => {
			let B = new r3(D),
				$ = new rq.WriteStream(D.file, { mode: D.mode || 438 });
			B.pipe($);
			let Z = new Promise((q, X) => {
				$.on("error", X), $.on("close", q), B.on("error", X);
			});
			return u9(B, F), _ ? Z.then(_, _) : Z;
		},
		tq = (D, F) => {
			F.forEach((_) => {
				if (_.charAt(0) === "@")
					nq({
						file: oq.resolve(D.cwd, _.slice(1)),
						sync: !0,
						noResume: !0,
						onentry: (B) => D.add(B),
					});
				else D.add(_);
			}),
				D.end();
		},
		u9 = (D, F) => {
			while (F.length) {
				let _ = F.shift();
				if (_.charAt(0) === "@")
					return nq({
						file: oq.resolve(D.cwd, _.slice(1)),
						noResume: !0,
						onentry: (B) => D.add(B),
					}).then((B) => u9(D, F));
				else D.add(_);
			}
			D.end();
		},
		zU = (D, F) => {
			let _ = new r3.Sync(D);
			return tq(_, F), _;
		},
		AU = (D, F) => {
			let _ = new r3(D);
			return u9(_, F), _;
		};
});
var N9 = W((Jj, XZ) => {
	var LU = R2(),
		FZ = S3(),
		W0 = R("fs"),
		_Z = m2(),
		BZ = s3(),
		$Z = R("path"),
		qZ = u2();
	XZ.exports = (D, F, _) => {
		let B = LU(D);
		if (!B.file) throw new TypeError("file is required");
		if (B.gzip || B.brotli || B.file.endsWith(".br") || B.file.endsWith(".tbr"))
			throw new TypeError("cannot append to compressed archives");
		if (!F || !Array.isArray(F) || !F.length)
			throw new TypeError("no files or directories specified");
		return (F = Array.from(F)), B.sync ? GU(B, F) : CU(B, F, _);
	};
	var GU = (D, F) => {
			let _ = new FZ.Sync(D),
				B = !0,
				$,
				Z;
			try {
				try {
					$ = W0.openSync(D.file, "r+");
				} catch (Q) {
					if (Q.code === "ENOENT") $ = W0.openSync(D.file, "w+");
					else throw Q;
				}
				let q = W0.fstatSync($),
					X = Buffer.alloc(512);
				D: for (Z = 0; Z < q.size; Z += 512) {
					for (let z = 0, A = 0; z < 512; z += A) {
						if (
							((A = W0.readSync($, X, z, X.length - z, Z + z)),
							Z === 0 && X[0] === 31 && X[1] === 139)
						)
							throw new Error("cannot append to compressed archives");
						if (!A) break D;
					}
					let Q = new qZ(X);
					if (!Q.cksumValid) break;
					let J = 512 * Math.ceil(Q.size / 512);
					if (Z + J + 512 > q.size) break;
					if (((Z += J), D.mtimeCache)) D.mtimeCache.set(Q.path, Q.mtime);
				}
				(B = !1), VU(D, _, Z, $, F);
			} finally {
				if (B)
					try {
						W0.closeSync($);
					} catch (q) {}
			}
		},
		VU = (D, F, _, B, $) => {
			let Z = new _Z.WriteStreamSync(D.file, { fd: B, start: _ });
			F.pipe(Z), WU(F, $);
		},
		CU = (D, F, _) => {
			F = Array.from(F);
			let B = new FZ(D),
				$ = (q, X, Q) => {
					let J = (H, V) => {
							if (H) W0.close(q, (C) => Q(H));
							else Q(null, V);
						},
						z = 0;
					if (X === 0) return J(null, 0);
					let A = 0,
						L = Buffer.alloc(512),
						G = (H, V) => {
							if (H) return J(H);
							if (((A += V), A < 512 && V))
								return W0.read(q, L, A, L.length - A, z + A, G);
							if (z === 0 && L[0] === 31 && L[1] === 139)
								return J(new Error("cannot append to compressed archives"));
							if (A < 512) return J(null, z);
							let C = new qZ(L);
							if (!C.cksumValid) return J(null, z);
							let K = 512 * Math.ceil(C.size / 512);
							if (z + K + 512 > X) return J(null, z);
							if (((z += K + 512), z >= X)) return J(null, z);
							if (D.mtimeCache) D.mtimeCache.set(C.path, C.mtime);
							(A = 0), W0.read(q, L, 0, 512, z, G);
						};
					W0.read(q, L, 0, 512, z, G);
				},
				Z = new Promise((q, X) => {
					B.on("error", X);
					let Q = "r+",
						J = (z, A) => {
							if (z && z.code === "ENOENT" && Q === "r+")
								return (Q = "w+"), W0.open(D.file, Q, J);
							if (z) return X(z);
							W0.fstat(A, (L, G) => {
								if (L) return W0.close(A, () => X(L));
								$(A, G.size, (H, V) => {
									if (H) return X(H);
									let C = new _Z.WriteStream(D.file, { fd: A, start: V });
									B.pipe(C), C.on("error", X), C.on("close", q), ZZ(B, F);
								});
							});
						};
					W0.open(D.file, Q, J);
				});
			return _ ? Z.then(_, _) : Z;
		},
		WU = (D, F) => {
			F.forEach((_) => {
				if (_.charAt(0) === "@")
					BZ({
						file: $Z.resolve(D.cwd, _.slice(1)),
						sync: !0,
						noResume: !0,
						onentry: (B) => D.add(B),
					});
				else D.add(_);
			}),
				D.end();
		},
		ZZ = (D, F) => {
			while (F.length) {
				let _ = F.shift();
				if (_.charAt(0) === "@")
					return BZ({
						file: $Z.resolve(D.cwd, _.slice(1)),
						noResume: !0,
						onentry: (B) => D.add(B),
					}).then((B) => ZZ(D, F));
				else D.add(_);
			}
			D.end();
		};
});
var JZ = W((zj, QZ) => {
	var HU = R2(),
		KU = N9();
	QZ.exports = (D, F, _) => {
		let B = HU(D);
		if (!B.file) throw new TypeError("file is required");
		if (B.gzip || B.brotli || B.file.endsWith(".br") || B.file.endsWith(".tbr"))
			throw new TypeError("cannot append to compressed archives");
		if (!F || !Array.isArray(F) || !F.length)
			throw new TypeError("no files or directories specified");
		return (F = Array.from(F)), YU(B), KU(B, F, _);
	};
	var YU = (D) => {
		let F = D.filter;
		if (!D.mtimeCache) D.mtimeCache = new Map();
		D.filter = F
			? (_, B) => F(_, B) && !(D.mtimeCache.get(_) > B.mtime)
			: (_, B) => !(D.mtimeCache.get(_) > B.mtime);
	};
});
var LZ = W((Aj, AZ) => {
	var { promisify: zZ } = R("util"),
		mD = R("fs"),
		IU = (D) => {
			if (!D) D = { mode: 511, fs: mD };
			else if (typeof D === "object") D = { mode: 511, fs: mD, ...D };
			else if (typeof D === "number") D = { mode: D, fs: mD };
			else if (typeof D === "string") D = { mode: parseInt(D, 8), fs: mD };
			else throw new TypeError("invalid options argument");
			return (
				(D.mkdir = D.mkdir || D.fs.mkdir || mD.mkdir),
				(D.mkdirAsync = zZ(D.mkdir)),
				(D.stat = D.stat || D.fs.stat || mD.stat),
				(D.statAsync = zZ(D.stat)),
				(D.statSync = D.statSync || D.fs.statSync || mD.statSync),
				(D.mkdirSync = D.mkdirSync || D.fs.mkdirSync || mD.mkdirSync),
				D
			);
		};
	AZ.exports = IU;
});
var VZ = W((Lj, GZ) => {
	var UU = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform,
		{ resolve: MU, parse: RU } = R("path"),
		PU = (D) => {
			if (/\0/.test(D))
				throw Object.assign(
					new TypeError("path must be a string without null bytes"),
					{ path: D, code: "ERR_INVALID_ARG_VALUE" },
				);
			if (((D = MU(D)), UU === "win32")) {
				let F = /[*|"<>?:]/,
					{ root: _ } = RU(D);
				if (F.test(D.substr(_.length)))
					throw Object.assign(new Error("Illegal characters in path."), {
						path: D,
						code: "EINVAL",
					});
			}
			return D;
		};
	GZ.exports = PU;
});
var YZ = W((Gj, KZ) => {
	var { dirname: CZ } = R("path"),
		WZ = (D, F, _ = void 0) => {
			if (_ === F) return Promise.resolve();
			return D.statAsync(F).then(
				(B) => (B.isDirectory() ? _ : void 0),
				(B) => (B.code === "ENOENT" ? WZ(D, CZ(F), F) : void 0),
			);
		},
		HZ = (D, F, _ = void 0) => {
			if (_ === F) return;
			try {
				return D.statSync(F).isDirectory() ? _ : void 0;
			} catch (B) {
				return B.code === "ENOENT" ? HZ(D, CZ(F), F) : void 0;
			}
		};
	KZ.exports = { findMade: WZ, findMadeSync: HZ };
});
var x9 = W((Vj, UZ) => {
	var { dirname: IZ } = R("path"),
		S9 = (D, F, _) => {
			F.recursive = !1;
			let B = IZ(D);
			if (B === D)
				return F.mkdirAsync(D, F).catch(($) => {
					if ($.code !== "EISDIR") throw $;
				});
			return F.mkdirAsync(D, F).then(
				() => _ || D,
				($) => {
					if ($.code === "ENOENT") return S9(B, F).then((Z) => S9(D, F, Z));
					if ($.code !== "EEXIST" && $.code !== "EROFS") throw $;
					return F.statAsync(D).then(
						(Z) => {
							if (Z.isDirectory()) return _;
							else throw $;
						},
						() => {
							throw $;
						},
					);
				},
			);
		},
		E9 = (D, F, _) => {
			let B = IZ(D);
			if (((F.recursive = !1), B === D))
				try {
					return F.mkdirSync(D, F);
				} catch ($) {
					if ($.code !== "EISDIR") throw $;
					else return;
				}
			try {
				return F.mkdirSync(D, F), _ || D;
			} catch ($) {
				if ($.code === "ENOENT") return E9(D, F, E9(B, F, _));
				if ($.code !== "EEXIST" && $.code !== "EROFS") throw $;
				try {
					if (!F.statSync(D).isDirectory()) throw $;
				} catch (Z) {
					throw $;
				}
			}
		};
	UZ.exports = { mkdirpManual: S9, mkdirpManualSync: E9 };
});
var PZ = W((Cj, RZ) => {
	var { dirname: MZ } = R("path"),
		{ findMade: TU, findMadeSync: OU } = YZ(),
		{ mkdirpManual: wU, mkdirpManualSync: jU } = x9(),
		uU = (D, F) => {
			if (((F.recursive = !0), MZ(D) === D)) return F.mkdirAsync(D, F);
			return TU(F, D).then((B) =>
				F.mkdirAsync(D, F)
					.then(() => B)
					.catch(($) => {
						if ($.code === "ENOENT") return wU(D, F);
						else throw $;
					}),
			);
		},
		NU = (D, F) => {
			if (((F.recursive = !0), MZ(D) === D)) return F.mkdirSync(D, F);
			let B = OU(F, D);
			try {
				return F.mkdirSync(D, F), B;
			} catch ($) {
				if ($.code === "ENOENT") return jU(D, F);
				else throw $;
			}
		};
	RZ.exports = { mkdirpNative: uU, mkdirpNativeSync: NU };
});
var jZ = W((Wj, wZ) => {
	var TZ = R("fs"),
		SU = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version,
		b9 = SU.replace(/^v/, "").split("."),
		OZ = +b9[0] > 10 || (+b9[0] === 10 && +b9[1] >= 12),
		EU = !OZ ? () => !1 : (D) => D.mkdir === TZ.mkdir,
		xU = !OZ ? () => !1 : (D) => D.mkdirSync === TZ.mkdirSync;
	wZ.exports = { useNative: EU, useNativeSync: xU };
});
var bZ = W((Hj, xZ) => {
	var l2 = LZ(),
		d2 = VZ(),
		{ mkdirpNative: uZ, mkdirpNativeSync: NZ } = PZ(),
		{ mkdirpManual: SZ, mkdirpManualSync: EZ } = x9(),
		{ useNative: bU, useNativeSync: gU } = jZ(),
		c2 = (D, F) => {
			return (D = d2(D)), (F = l2(F)), bU(F) ? uZ(D, F) : SZ(D, F);
		},
		vU = (D, F) => {
			return (D = d2(D)), (F = l2(F)), gU(F) ? NZ(D, F) : EZ(D, F);
		};
	c2.sync = vU;
	c2.native = (D, F) => uZ(d2(D), l2(F));
	c2.manual = (D, F) => SZ(d2(D), l2(F));
	c2.nativeSync = (D, F) => NZ(d2(D), l2(F));
	c2.manualSync = (D, F) => EZ(d2(D), l2(F));
	xZ.exports = c2;
});
var hZ = W((Kj, mZ) => {
	var M0 = R("fs"),
		Q2 = R("path"),
		yU = M0.lchown ? "lchown" : "chown",
		kU = M0.lchownSync ? "lchownSync" : "chownSync",
		vZ =
			M0.lchown &&
			!process.version.match(/v1[1-9]+\./) &&
			!process.version.match(/v10\.[6-9]/),
		gZ = (D, F, _) => {
			try {
				return M0[kU](D, F, _);
			} catch (B) {
				if (B.code !== "ENOENT") throw B;
			}
		},
		fU = (D, F, _) => {
			try {
				return M0.chownSync(D, F, _);
			} catch (B) {
				if (B.code !== "ENOENT") throw B;
			}
		},
		mU = vZ
			? (D, F, _, B) => ($) => {
					if (!$ || $.code !== "EISDIR") B($);
					else M0.chown(D, F, _, B);
				}
			: (D, F, _, B) => B,
		g9 = vZ
			? (D, F, _) => {
					try {
						return gZ(D, F, _);
					} catch (B) {
						if (B.code !== "EISDIR") throw B;
						fU(D, F, _);
					}
				}
			: (D, F, _) => gZ(D, F, _),
		hU = process.version,
		yZ = (D, F, _) => M0.readdir(D, F, _),
		lU = (D, F) => M0.readdirSync(D, F);
	if (/^v4\./.test(hU)) yZ = (D, F, _) => M0.readdir(D, _);
	var n3 = (D, F, _, B) => {
			M0[yU](
				D,
				F,
				_,
				mU(D, F, _, ($) => {
					B($ && $.code !== "ENOENT" ? $ : null);
				}),
			);
		},
		kZ = (D, F, _, B, $) => {
			if (typeof F === "string")
				return M0.lstat(Q2.resolve(D, F), (Z, q) => {
					if (Z) return $(Z.code !== "ENOENT" ? Z : null);
					(q.name = F), kZ(D, q, _, B, $);
				});
			if (F.isDirectory())
				v9(Q2.resolve(D, F.name), _, B, (Z) => {
					if (Z) return $(Z);
					let q = Q2.resolve(D, F.name);
					n3(q, _, B, $);
				});
			else {
				let Z = Q2.resolve(D, F.name);
				n3(Z, _, B, $);
			}
		},
		v9 = (D, F, _, B) => {
			yZ(D, { withFileTypes: !0 }, ($, Z) => {
				if ($) {
					if ($.code === "ENOENT") return B();
					else if ($.code !== "ENOTDIR" && $.code !== "ENOTSUP") return B($);
				}
				if ($ || !Z.length) return n3(D, F, _, B);
				let q = Z.length,
					X = null,
					Q = (J) => {
						if (X) return;
						if (J) return B((X = J));
						if (--q === 0) return n3(D, F, _, B);
					};
				Z.forEach((J) => kZ(D, J, F, _, Q));
			});
		},
		dU = (D, F, _, B) => {
			if (typeof F === "string")
				try {
					let $ = M0.lstatSync(Q2.resolve(D, F));
					($.name = F), (F = $);
				} catch ($) {
					if ($.code === "ENOENT") return;
					else throw $;
				}
			if (F.isDirectory()) fZ(Q2.resolve(D, F.name), _, B);
			g9(Q2.resolve(D, F.name), _, B);
		},
		fZ = (D, F, _) => {
			let B;
			try {
				B = lU(D, { withFileTypes: !0 });
			} catch ($) {
				if ($.code === "ENOENT") return;
				else if ($.code === "ENOTDIR" || $.code === "ENOTSUP")
					return g9(D, F, _);
				else throw $;
			}
			if (B && B.length) B.forEach(($) => dU(D, $, F, _));
			return g9(D, F, _);
		};
	mZ.exports = v9;
	v9.sync = fZ;
});
var pZ = W((Yj, f9) => {
	var lZ = bZ(),
		R0 = R("fs"),
		o3 = R("path"),
		dZ = hZ(),
		S0 = w2();
	class y9 extends Error {
		constructor(D, F) {
			super("Cannot extract through symbolic link");
			(this.path = F), (this.symlink = D);
		}
		get name() {
			return "SylinkError";
		}
	}
	class k9 extends Error {
		constructor(D, F) {
			super(F + ": Cannot cd into '" + D + "'");
			(this.path = D), (this.code = F);
		}
		get name() {
			return "CwdError";
		}
	}
	var t3 = (D, F) => D.get(S0(F)),
		l1 = (D, F, _) => D.set(S0(F), _),
		cU = (D, F) => {
			R0.stat(D, (_, B) => {
				if (_ || !B.isDirectory()) _ = new k9(D, (_ && _.code) || "ENOTDIR");
				F(_);
			});
		};
	f9.exports = (D, F, _) => {
		D = S0(D);
		let B = F.umask,
			$ = F.mode | 448,
			Z = ($ & B) !== 0,
			q = F.uid,
			X = F.gid,
			Q =
				typeof q === "number" &&
				typeof X === "number" &&
				(q !== F.processUid || X !== F.processGid),
			J = F.preserve,
			z = F.unlink,
			A = F.cache,
			L = S0(F.cwd),
			G = (C, K) => {
				if (C) _(C);
				else if ((l1(A, D, !0), K && Q)) dZ(K, q, X, (I) => G(I));
				else if (Z) R0.chmod(D, $, _);
				else _();
			};
		if (A && t3(A, D) === !0) return G();
		if (D === L) return cU(D, G);
		if (J) return lZ(D, { mode: $ }).then((C) => G(null, C), G);
		let V = S0(o3.relative(L, D)).split("/");
		e3(L, V, $, A, z, L, null, G);
	};
	var e3 = (D, F, _, B, $, Z, q, X) => {
			if (!F.length) return X(null, q);
			let Q = F.shift(),
				J = S0(o3.resolve(D + "/" + Q));
			if (t3(B, J)) return e3(J, F, _, B, $, Z, q, X);
			R0.mkdir(J, _, cZ(J, F, _, B, $, Z, q, X));
		},
		cZ = (D, F, _, B, $, Z, q, X) => (Q) => {
			if (Q)
				R0.lstat(D, (J, z) => {
					if (J) (J.path = J.path && S0(J.path)), X(J);
					else if (z.isDirectory()) e3(D, F, _, B, $, Z, q, X);
					else if ($)
						R0.unlink(D, (A) => {
							if (A) return X(A);
							R0.mkdir(D, _, cZ(D, F, _, B, $, Z, q, X));
						});
					else if (z.isSymbolicLink())
						return X(new y9(D, D + "/" + F.join("/")));
					else X(Q);
				});
			else (q = q || D), e3(D, F, _, B, $, Z, q, X);
		},
		pU = (D) => {
			let F = !1,
				_ = "ENOTDIR";
			try {
				F = R0.statSync(D).isDirectory();
			} catch (B) {
				_ = B.code;
			} finally {
				if (!F) throw new k9(D, _);
			}
		};
	f9.exports.sync = (D, F) => {
		D = S0(D);
		let _ = F.umask,
			B = F.mode | 448,
			$ = (B & _) !== 0,
			Z = F.uid,
			q = F.gid,
			X =
				typeof Z === "number" &&
				typeof q === "number" &&
				(Z !== F.processUid || q !== F.processGid),
			Q = F.preserve,
			J = F.unlink,
			z = F.cache,
			A = S0(F.cwd),
			L = (C) => {
				if ((l1(z, D, !0), C && X)) dZ.sync(C, Z, q);
				if ($) R0.chmodSync(D, B);
			};
		if (z && t3(z, D) === !0) return L();
		if (D === A) return pU(A), L();
		if (Q) return L(lZ.sync(D, B));
		let H = S0(o3.relative(A, D)).split("/"),
			V = null;
		for (let C = H.shift(), K = A; C && (K += "/" + C); C = H.shift()) {
			if (((K = S0(o3.resolve(K))), t3(z, K))) continue;
			try {
				R0.mkdirSync(K, B), (V = V || K), l1(z, K, !0);
			} catch (I) {
				let M = R0.lstatSync(K);
				if (M.isDirectory()) {
					l1(z, K, !0);
					continue;
				} else if (J) {
					R0.unlinkSync(K), R0.mkdirSync(K, B), (V = V || K), l1(z, K, !0);
					continue;
				} else if (M.isSymbolicLink()) return new y9(K, K + "/" + H.join("/"));
			}
		}
		return L(V);
	};
});
var h9 = W((Ij, aZ) => {
	var m9 = Object.create(null),
		{ hasOwnProperty: aU } = Object.prototype;
	aZ.exports = (D) => {
		if (!aU.call(m9, D)) m9[D] = D.normalize("NFD");
		return m9[D];
	};
});
var nZ = W((Uj, rZ) => {
	var iZ = R("assert"),
		iU = h9(),
		sU = N2(),
		{ join: sZ } = R("path"),
		rU = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform,
		nU = rU === "win32";
	rZ.exports = () => {
		let D = new Map(),
			F = new Map(),
			_ = (J) => {
				return J.split("/")
					.slice(0, -1)
					.reduce((A, L) => {
						if (A.length) L = sZ(A[A.length - 1], L);
						return A.push(L || "/"), A;
					}, []);
			},
			B = new Set(),
			$ = (J) => {
				let z = F.get(J);
				if (!z) throw new Error("function does not have any path reservations");
				return {
					paths: z.paths.map((A) => D.get(A)),
					dirs: [...z.dirs].map((A) => D.get(A)),
				};
			},
			Z = (J) => {
				let { paths: z, dirs: A } = $(J);
				return (
					z.every((L) => L[0] === J) &&
					A.every((L) => L[0] instanceof Set && L[0].has(J))
				);
			},
			q = (J) => {
				if (B.has(J) || !Z(J)) return !1;
				return B.add(J), J(() => X(J)), !0;
			},
			X = (J) => {
				if (!B.has(J)) return !1;
				let { paths: z, dirs: A } = F.get(J),
					L = new Set();
				return (
					z.forEach((G) => {
						let H = D.get(G);
						if ((iZ.equal(H[0], J), H.length === 1)) D.delete(G);
						else if ((H.shift(), typeof H[0] === "function")) L.add(H[0]);
						else H[0].forEach((V) => L.add(V));
					}),
					A.forEach((G) => {
						let H = D.get(G);
						if ((iZ(H[0] instanceof Set), H[0].size === 1 && H.length === 1))
							D.delete(G);
						else if (H[0].size === 1) H.shift(), L.add(H[0]);
						else H[0].delete(J);
					}),
					B.delete(J),
					L.forEach((G) => q(G)),
					!0
				);
			};
		return {
			check: Z,
			reserve: (J, z) => {
				J = nU
					? ["win32 parallelization disabled"]
					: J.map((L) => {
							return sU(sZ(iU(L))).toLowerCase();
						});
				let A = new Set(J.map((L) => _(L)).reduce((L, G) => L.concat(G)));
				return (
					F.set(z, { dirs: A, paths: J }),
					J.forEach((L) => {
						let G = D.get(L);
						if (!G) D.set(L, [z]);
						else G.push(z);
					}),
					A.forEach((L) => {
						let G = D.get(L);
						if (!G) D.set(L, [new Set([z])]);
						else if (G[G.length - 1] instanceof Set) G[G.length - 1].add(z);
						else G.push(new Set([z]));
					}),
					q(z)
				);
			},
		};
	};
});
var eZ = W((Mj, tZ) => {
	var oU = process.env.__FAKE_PLATFORM__ || process.platform,
		tU = oU === "win32",
		eU = global.__FAKE_TESTING_FS__ || R("fs"),
		{
			O_CREAT: DM,
			O_TRUNC: FM,
			O_WRONLY: _M,
			UV_FS_O_FILEMAP: oZ = 0,
		} = eU.constants,
		BM = tU && !!oZ,
		$M = oZ | FM | DM | _M;
	tZ.exports = !BM ? () => "w" : (D) => (D < 524288 ? $M : "w");
});
var r9 = W((Rj, VX) => {
	var qM = R("assert"),
		ZM = i3(),
		N = R("fs"),
		XM = m2(),
		GD = R("path"),
		zX = pZ(),
		DX = d7(),
		QM = nZ(),
		JM = c7(),
		P0 = w2(),
		zM = N2(),
		AM = h9(),
		FX = Symbol("onEntry"),
		c9 = Symbol("checkFs"),
		_X = Symbol("checkFs2"),
		_8 = Symbol("pruneCache"),
		p9 = Symbol("isReusable"),
		T0 = Symbol("makeFs"),
		a9 = Symbol("file"),
		i9 = Symbol("directory"),
		B8 = Symbol("link"),
		BX = Symbol("symlink"),
		$X = Symbol("hardlink"),
		qX = Symbol("unsupported"),
		ZX = Symbol("checkPath"),
		hD = Symbol("mkdir"),
		$0 = Symbol("onError"),
		D8 = Symbol("pending"),
		XX = Symbol("pend"),
		p2 = Symbol("unpend"),
		l9 = Symbol("ended"),
		d9 = Symbol("maybeClose"),
		s9 = Symbol("skip"),
		d1 = Symbol("doChown"),
		c1 = Symbol("uid"),
		p1 = Symbol("gid"),
		a1 = Symbol("checkedCwd"),
		AX = R("crypto"),
		LX = eZ(),
		LM = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform,
		i1 = LM === "win32",
		GM = (D, F) => {
			if (!i1) return N.unlink(D, F);
			let _ = D + ".DELETE." + AX.randomBytes(16).toString("hex");
			N.rename(D, _, (B) => {
				if (B) return F(B);
				N.unlink(_, F);
			});
		},
		VM = (D) => {
			if (!i1) return N.unlinkSync(D);
			let F = D + ".DELETE." + AX.randomBytes(16).toString("hex");
			N.renameSync(D, F), N.unlinkSync(F);
		},
		QX = (D, F, _) => (D === D >>> 0 ? D : F === F >>> 0 ? F : _),
		JX = (D) => zM(P0(AM(D))).toLowerCase(),
		CM = (D, F) => {
			F = JX(F);
			for (let _ of D.keys()) {
				let B = JX(_);
				if (B === F || B.indexOf(F + "/") === 0) D.delete(_);
			}
		},
		WM = (D) => {
			for (let F of D.keys()) D.delete(F);
		};
	class $8 extends ZM {
		constructor(D) {
			if (!D) D = {};
			D.ondone = (F) => {
				(this[l9] = !0), this[d9]();
			};
			super(D);
			if (
				((this[a1] = !1),
				(this.reservations = QM()),
				(this.transform =
					typeof D.transform === "function" ? D.transform : null),
				(this.writable = !0),
				(this.readable = !1),
				(this[D8] = 0),
				(this[l9] = !1),
				(this.dirCache = D.dirCache || new Map()),
				typeof D.uid === "number" || typeof D.gid === "number")
			) {
				if (typeof D.uid !== "number" || typeof D.gid !== "number")
					throw new TypeError("cannot set owner without number uid and gid");
				if (D.preserveOwner)
					throw new TypeError(
						"cannot preserve owner in archive and also set owner explicitly",
					);
				(this.uid = D.uid), (this.gid = D.gid), (this.setOwner = !0);
			} else (this.uid = null), (this.gid = null), (this.setOwner = !1);
			if (D.preserveOwner === void 0 && typeof D.uid !== "number")
				this.preserveOwner = process.getuid && process.getuid() === 0;
			else this.preserveOwner = !!D.preserveOwner;
			(this.processUid =
				(this.preserveOwner || this.setOwner) && process.getuid
					? process.getuid()
					: null),
				(this.processGid =
					(this.preserveOwner || this.setOwner) && process.getgid
						? process.getgid()
						: null),
				(this.maxDepth = typeof D.maxDepth === "number" ? D.maxDepth : 1024),
				(this.forceChown = D.forceChown === !0),
				(this.win32 = !!D.win32 || i1),
				(this.newer = !!D.newer),
				(this.keep = !!D.keep),
				(this.noMtime = !!D.noMtime),
				(this.preservePaths = !!D.preservePaths),
				(this.unlink = !!D.unlink),
				(this.cwd = P0(GD.resolve(D.cwd || process.cwd()))),
				(this.strip = +D.strip || 0),
				(this.processUmask = D.noChmod ? 0 : process.umask()),
				(this.umask =
					typeof D.umask === "number" ? D.umask : this.processUmask),
				(this.dmode = D.dmode || 511 & ~this.umask),
				(this.fmode = D.fmode || 438 & ~this.umask),
				this.on("entry", (F) => this[FX](F));
		}
		warn(D, F, _ = {}) {
			if (D === "TAR_BAD_ARCHIVE" || D === "TAR_ABORT") _.recoverable = !1;
			return super.warn(D, F, _);
		}
		[d9]() {
			if (this[l9] && this[D8] === 0)
				this.emit("prefinish"), this.emit("finish"), this.emit("end");
		}
		[ZX](D) {
			let F = P0(D.path),
				_ = F.split("/");
			if (this.strip) {
				if (_.length < this.strip) return !1;
				if (D.type === "Link") {
					let B = P0(D.linkpath).split("/");
					if (B.length >= this.strip)
						D.linkpath = B.slice(this.strip).join("/");
					else return !1;
				}
				_.splice(0, this.strip), (D.path = _.join("/"));
			}
			if (isFinite(this.maxDepth) && _.length > this.maxDepth)
				return (
					this.warn("TAR_ENTRY_ERROR", "path excessively deep", {
						entry: D,
						path: F,
						depth: _.length,
						maxDepth: this.maxDepth,
					}),
					!1
				);
			if (!this.preservePaths) {
				if (_.includes("..") || (i1 && /^[a-z]:\.\.$/i.test(_[0])))
					return (
						this.warn("TAR_ENTRY_ERROR", "path contains '..'", {
							entry: D,
							path: F,
						}),
						!1
					);
				let [B, $] = JM(F);
				if (B)
					(D.path = $),
						this.warn("TAR_ENTRY_INFO", `stripping ${B} from absolute path`, {
							entry: D,
							path: F,
						});
			}
			if (GD.isAbsolute(D.path)) D.absolute = P0(GD.resolve(D.path));
			else D.absolute = P0(GD.resolve(this.cwd, D.path));
			if (
				!this.preservePaths &&
				D.absolute.indexOf(this.cwd + "/") !== 0 &&
				D.absolute !== this.cwd
			)
				return (
					this.warn("TAR_ENTRY_ERROR", "path escaped extraction target", {
						entry: D,
						path: P0(D.path),
						resolvedPath: D.absolute,
						cwd: this.cwd,
					}),
					!1
				);
			if (
				D.absolute === this.cwd &&
				D.type !== "Directory" &&
				D.type !== "GNUDumpDir"
			)
				return !1;
			if (this.win32) {
				let { root: B } = GD.win32.parse(D.absolute);
				D.absolute = B + DX.encode(D.absolute.slice(B.length));
				let { root: $ } = GD.win32.parse(D.path);
				D.path = $ + DX.encode(D.path.slice($.length));
			}
			return !0;
		}
		[FX](D) {
			if (!this[ZX](D)) return D.resume();
			switch ((qM.equal(typeof D.absolute, "string"), D.type)) {
				case "Directory":
				case "GNUDumpDir":
					if (D.mode) D.mode = D.mode | 448;
				case "File":
				case "OldFile":
				case "ContiguousFile":
				case "Link":
				case "SymbolicLink":
					return this[c9](D);
				case "CharacterDevice":
				case "BlockDevice":
				case "FIFO":
				default:
					return this[qX](D);
			}
		}
		[$0](D, F) {
			if (D.name === "CwdError") this.emit("error", D);
			else
				this.warn("TAR_ENTRY_ERROR", D, { entry: F }), this[p2](), F.resume();
		}
		[hD](D, F, _) {
			zX(
				P0(D),
				{
					uid: this.uid,
					gid: this.gid,
					processUid: this.processUid,
					processGid: this.processGid,
					umask: this.processUmask,
					preserve: this.preservePaths,
					unlink: this.unlink,
					cache: this.dirCache,
					cwd: this.cwd,
					mode: F,
					noChmod: this.noChmod,
				},
				_,
			);
		}
		[d1](D) {
			return (
				this.forceChown ||
				(this.preserveOwner &&
					((typeof D.uid === "number" && D.uid !== this.processUid) ||
						(typeof D.gid === "number" && D.gid !== this.processGid))) ||
				(typeof this.uid === "number" && this.uid !== this.processUid) ||
				(typeof this.gid === "number" && this.gid !== this.processGid)
			);
		}
		[c1](D) {
			return QX(this.uid, D.uid, this.processUid);
		}
		[p1](D) {
			return QX(this.gid, D.gid, this.processGid);
		}
		[a9](D, F) {
			let _ = D.mode & 4095 || this.fmode,
				B = new XM.WriteStream(D.absolute, {
					flags: LX(D.size),
					mode: _,
					autoClose: !1,
				});
			B.on("error", (X) => {
				if (B.fd) N.close(B.fd, () => {});
				(B.write = () => !0), this[$0](X, D), F();
			});
			let $ = 1,
				Z = (X) => {
					if (X) {
						if (B.fd) N.close(B.fd, () => {});
						this[$0](X, D), F();
						return;
					}
					if (--$ === 0)
						N.close(B.fd, (Q) => {
							if (Q) this[$0](Q, D);
							else this[p2]();
							F();
						});
				};
			B.on("finish", (X) => {
				let Q = D.absolute,
					J = B.fd;
				if (D.mtime && !this.noMtime) {
					$++;
					let z = D.atime || new Date(),
						A = D.mtime;
					N.futimes(J, z, A, (L) =>
						L ? N.utimes(Q, z, A, (G) => Z(G && L)) : Z(),
					);
				}
				if (this[d1](D)) {
					$++;
					let z = this[c1](D),
						A = this[p1](D);
					N.fchown(J, z, A, (L) =>
						L ? N.chown(Q, z, A, (G) => Z(G && L)) : Z(),
					);
				}
				Z();
			});
			let q = this.transform ? this.transform(D) || D : D;
			if (q !== D)
				q.on("error", (X) => {
					this[$0](X, D), F();
				}),
					D.pipe(q);
			q.pipe(B);
		}
		[i9](D, F) {
			let _ = D.mode & 4095 || this.dmode;
			this[hD](D.absolute, _, (B) => {
				if (B) {
					this[$0](B, D), F();
					return;
				}
				let $ = 1,
					Z = (q) => {
						if (--$ === 0) F(), this[p2](), D.resume();
					};
				if (D.mtime && !this.noMtime)
					$++, N.utimes(D.absolute, D.atime || new Date(), D.mtime, Z);
				if (this[d1](D)) $++, N.chown(D.absolute, this[c1](D), this[p1](D), Z);
				Z();
			});
		}
		[qX](D) {
			(D.unsupported = !0),
				this.warn(
					"TAR_ENTRY_UNSUPPORTED",
					`unsupported entry type: ${D.type}`,
					{ entry: D },
				),
				D.resume();
		}
		[BX](D, F) {
			this[B8](D, D.linkpath, "symlink", F);
		}
		[$X](D, F) {
			let _ = P0(GD.resolve(this.cwd, D.linkpath));
			this[B8](D, _, "link", F);
		}
		[XX]() {
			this[D8]++;
		}
		[p2]() {
			this[D8]--, this[d9]();
		}
		[s9](D) {
			this[p2](), D.resume();
		}
		[p9](D, F) {
			return (
				D.type === "File" && !this.unlink && F.isFile() && F.nlink <= 1 && !i1
			);
		}
		[c9](D) {
			this[XX]();
			let F = [D.path];
			if (D.linkpath) F.push(D.linkpath);
			this.reservations.reserve(F, (_) => this[_X](D, _));
		}
		[_8](D) {
			if (D.type === "SymbolicLink") WM(this.dirCache);
			else if (D.type !== "Directory") CM(this.dirCache, D.absolute);
		}
		[_X](D, F) {
			this[_8](D);
			let _ = (q) => {
					this[_8](D), F(q);
				},
				B = () => {
					this[hD](this.cwd, this.dmode, (q) => {
						if (q) {
							this[$0](q, D), _();
							return;
						}
						(this[a1] = !0), $();
					});
				},
				$ = () => {
					if (D.absolute !== this.cwd) {
						let q = P0(GD.dirname(D.absolute));
						if (q !== this.cwd)
							return this[hD](q, this.dmode, (X) => {
								if (X) {
									this[$0](X, D), _();
									return;
								}
								Z();
							});
					}
					Z();
				},
				Z = () => {
					N.lstat(D.absolute, (q, X) => {
						if (X && (this.keep || (this.newer && X.mtime > D.mtime))) {
							this[s9](D), _();
							return;
						}
						if (q || this[p9](D, X)) return this[T0](null, D, _);
						if (X.isDirectory()) {
							if (D.type === "Directory") {
								let Q = !this.noChmod && D.mode && (X.mode & 4095) !== D.mode,
									J = (z) => this[T0](z, D, _);
								if (!Q) return J();
								return N.chmod(D.absolute, D.mode, J);
							}
							if (D.absolute !== this.cwd)
								return N.rmdir(D.absolute, (Q) => this[T0](Q, D, _));
						}
						if (D.absolute === this.cwd) return this[T0](null, D, _);
						GM(D.absolute, (Q) => this[T0](Q, D, _));
					});
				};
			if (this[a1]) $();
			else B();
		}
		[T0](D, F, _) {
			if (D) {
				this[$0](D, F), _();
				return;
			}
			switch (F.type) {
				case "File":
				case "OldFile":
				case "ContiguousFile":
					return this[a9](F, _);
				case "Link":
					return this[$X](F, _);
				case "SymbolicLink":
					return this[BX](F, _);
				case "Directory":
				case "GNUDumpDir":
					return this[i9](F, _);
			}
		}
		[B8](D, F, _, B) {
			N[_](F, D.absolute, ($) => {
				if ($) this[$0]($, D);
				else this[p2](), D.resume();
				B();
			});
		}
	}
	var F8 = (D) => {
		try {
			return [null, D()];
		} catch (F) {
			return [F, null];
		}
	};
	class GX extends $8 {
		[T0](D, F) {
			return super[T0](D, F, () => {});
		}
		[c9](D) {
			if ((this[_8](D), !this[a1])) {
				let $ = this[hD](this.cwd, this.dmode);
				if ($) return this[$0]($, D);
				this[a1] = !0;
			}
			if (D.absolute !== this.cwd) {
				let $ = P0(GD.dirname(D.absolute));
				if ($ !== this.cwd) {
					let Z = this[hD]($, this.dmode);
					if (Z) return this[$0](Z, D);
				}
			}
			let [F, _] = F8(() => N.lstatSync(D.absolute));
			if (_ && (this.keep || (this.newer && _.mtime > D.mtime)))
				return this[s9](D);
			if (F || this[p9](D, _)) return this[T0](null, D);
			if (_.isDirectory()) {
				if (D.type === "Directory") {
					let Z = !this.noChmod && D.mode && (_.mode & 4095) !== D.mode,
						[q] = Z
							? F8(() => {
									N.chmodSync(D.absolute, D.mode);
								})
							: [];
					return this[T0](q, D);
				}
				let [$] = F8(() => N.rmdirSync(D.absolute));
				this[T0]($, D);
			}
			let [B] = D.absolute === this.cwd ? [] : F8(() => VM(D.absolute));
			this[T0](B, D);
		}
		[a9](D, F) {
			let _ = D.mode & 4095 || this.fmode,
				B = (q) => {
					let X;
					try {
						N.closeSync($);
					} catch (Q) {
						X = Q;
					}
					if (q || X) this[$0](q || X, D);
					F();
				},
				$;
			try {
				$ = N.openSync(D.absolute, LX(D.size), _);
			} catch (q) {
				return B(q);
			}
			let Z = this.transform ? this.transform(D) || D : D;
			if (Z !== D) Z.on("error", (q) => this[$0](q, D)), D.pipe(Z);
			Z.on("data", (q) => {
				try {
					N.writeSync($, q, 0, q.length);
				} catch (X) {
					B(X);
				}
			}),
				Z.on("end", (q) => {
					let X = null;
					if (D.mtime && !this.noMtime) {
						let Q = D.atime || new Date(),
							J = D.mtime;
						try {
							N.futimesSync($, Q, J);
						} catch (z) {
							try {
								N.utimesSync(D.absolute, Q, J);
							} catch (A) {
								X = z;
							}
						}
					}
					if (this[d1](D)) {
						let Q = this[c1](D),
							J = this[p1](D);
						try {
							N.fchownSync($, Q, J);
						} catch (z) {
							try {
								N.chownSync(D.absolute, Q, J);
							} catch (A) {
								X = X || z;
							}
						}
					}
					B(X);
				});
		}
		[i9](D, F) {
			let _ = D.mode & 4095 || this.dmode,
				B = this[hD](D.absolute, _);
			if (B) {
				this[$0](B, D), F();
				return;
			}
			if (D.mtime && !this.noMtime)
				try {
					N.utimesSync(D.absolute, D.atime || new Date(), D.mtime);
				} catch ($) {}
			if (this[d1](D))
				try {
					N.chownSync(D.absolute, this[c1](D), this[p1](D));
				} catch ($) {}
			F(), D.resume();
		}
		[hD](D, F) {
			try {
				return zX.sync(P0(D), {
					uid: this.uid,
					gid: this.gid,
					processUid: this.processUid,
					processGid: this.processGid,
					umask: this.processUmask,
					preserve: this.preservePaths,
					unlink: this.unlink,
					cache: this.dirCache,
					cwd: this.cwd,
					mode: F,
				});
			} catch (_) {
				return _;
			}
		}
		[B8](D, F, _, B) {
			try {
				N[_ + "Sync"](F, D.absolute), B(), D.resume();
			} catch ($) {
				return this[$0]($, D);
			}
		}
	}
	$8.Sync = GX;
	VX.exports = $8;
});
var YX = W((Pj, KX) => {
	var HM = R2(),
		q8 = r9(),
		WX = R("fs"),
		HX = m2(),
		CX = R("path"),
		n9 = N2();
	KX.exports = (D, F, _) => {
		if (typeof D === "function") (_ = D), (F = null), (D = {});
		else if (Array.isArray(D)) (F = D), (D = {});
		if (typeof F === "function") (_ = F), (F = null);
		if (!F) F = [];
		else F = Array.from(F);
		let B = HM(D);
		if (B.sync && typeof _ === "function")
			throw new TypeError("callback not supported for sync tar functions");
		if (!B.file && typeof _ === "function")
			throw new TypeError("callback only supported with file option");
		if (F.length) KM(B, F);
		return B.file && B.sync
			? YM(B)
			: B.file
				? IM(B, _)
				: B.sync
					? UM(B)
					: MM(B);
	};
	var KM = (D, F) => {
			let _ = new Map(F.map((Z) => [n9(Z), !0])),
				B = D.filter,
				$ = (Z, q) => {
					let X = q || CX.parse(Z).root || ".",
						Q = Z === X ? !1 : _.has(Z) ? _.get(Z) : $(CX.dirname(Z), X);
					return _.set(Z, Q), Q;
				};
			D.filter = B ? (Z, q) => B(Z, q) && $(n9(Z)) : (Z) => $(n9(Z));
		},
		YM = (D) => {
			let F = new q8.Sync(D),
				_ = D.file,
				B = WX.statSync(_),
				$ = D.maxReadSize || 16777216;
			new HX.ReadStreamSync(_, { readSize: $, size: B.size }).pipe(F);
		},
		IM = (D, F) => {
			let _ = new q8(D),
				B = D.maxReadSize || 16777216,
				$ = D.file,
				Z = new Promise((q, X) => {
					_.on("error", X),
						_.on("close", q),
						WX.stat($, (Q, J) => {
							if (Q) X(Q);
							else {
								let z = new HX.ReadStream($, { readSize: B, size: J.size });
								z.on("error", X), z.pipe(_);
							}
						});
				});
			return F ? Z.then(F, F) : Z;
		},
		UM = (D) => new q8.Sync(D),
		MM = (D) => new q8(D);
});
var IX = W((RM) => {
	RM.c = RM.create = DZ();
	RM.r = RM.replace = N9();
	RM.t = RM.list = s3();
	RM.u = RM.update = JZ();
	RM.x = RM.extract = YX();
	RM.Pack = S3();
	RM.Unpack = r9();
	RM.Parse = i3();
	RM.ReadEntry = C3();
	RM.WriteEntry = e7();
	RM.Header = u2();
	RM.Pax = H3();
	RM.types = y7();
});
var mX = W((Iu, qR) => {
	qR.exports = {
		dots: {
			interval: 80,
			frames: [
				"\u280B",
				"\u2819",
				"\u2839",
				"\u2838",
				"\u283C",
				"\u2834",
				"\u2826",
				"\u2827",
				"\u2807",
				"\u280F",
			],
		},
		dots2: {
			interval: 80,
			frames: [
				"\u28FE",
				"\u28FD",
				"\u28FB",
				"\u28BF",
				"\u287F",
				"\u28DF",
				"\u28EF",
				"\u28F7",
			],
		},
		dots3: {
			interval: 80,
			frames: [
				"\u280B",
				"\u2819",
				"\u281A",
				"\u281E",
				"\u2816",
				"\u2826",
				"\u2834",
				"\u2832",
				"\u2833",
				"\u2813",
			],
		},
		dots4: {
			interval: 80,
			frames: [
				"\u2804",
				"\u2806",
				"\u2807",
				"\u280B",
				"\u2819",
				"\u2838",
				"\u2830",
				"\u2820",
				"\u2830",
				"\u2838",
				"\u2819",
				"\u280B",
				"\u2807",
				"\u2806",
			],
		},
		dots5: {
			interval: 80,
			frames: [
				"\u280B",
				"\u2819",
				"\u281A",
				"\u2812",
				"\u2802",
				"\u2802",
				"\u2812",
				"\u2832",
				"\u2834",
				"\u2826",
				"\u2816",
				"\u2812",
				"\u2810",
				"\u2810",
				"\u2812",
				"\u2813",
				"\u280B",
			],
		},
		dots6: {
			interval: 80,
			frames: [
				"\u2801",
				"\u2809",
				"\u2819",
				"\u281A",
				"\u2812",
				"\u2802",
				"\u2802",
				"\u2812",
				"\u2832",
				"\u2834",
				"\u2824",
				"\u2804",
				"\u2804",
				"\u2824",
				"\u2834",
				"\u2832",
				"\u2812",
				"\u2802",
				"\u2802",
				"\u2812",
				"\u281A",
				"\u2819",
				"\u2809",
				"\u2801",
			],
		},
		dots7: {
			interval: 80,
			frames: [
				"\u2808",
				"\u2809",
				"\u280B",
				"\u2813",
				"\u2812",
				"\u2810",
				"\u2810",
				"\u2812",
				"\u2816",
				"\u2826",
				"\u2824",
				"\u2820",
				"\u2820",
				"\u2824",
				"\u2826",
				"\u2816",
				"\u2812",
				"\u2810",
				"\u2810",
				"\u2812",
				"\u2813",
				"\u280B",
				"\u2809",
				"\u2808",
			],
		},
		dots8: {
			interval: 80,
			frames: [
				"\u2801",
				"\u2801",
				"\u2809",
				"\u2819",
				"\u281A",
				"\u2812",
				"\u2802",
				"\u2802",
				"\u2812",
				"\u2832",
				"\u2834",
				"\u2824",
				"\u2804",
				"\u2804",
				"\u2824",
				"\u2820",
				"\u2820",
				"\u2824",
				"\u2826",
				"\u2816",
				"\u2812",
				"\u2810",
				"\u2810",
				"\u2812",
				"\u2813",
				"\u280B",
				"\u2809",
				"\u2808",
				"\u2808",
			],
		},
		dots9: {
			interval: 80,
			frames: [
				"\u28B9",
				"\u28BA",
				"\u28BC",
				"\u28F8",
				"\u28C7",
				"\u2867",
				"\u2857",
				"\u284F",
			],
		},
		dots10: {
			interval: 80,
			frames: [
				"\u2884",
				"\u2882",
				"\u2881",
				"\u2841",
				"\u2848",
				"\u2850",
				"\u2860",
			],
		},
		dots11: {
			interval: 100,
			frames: [
				"\u2801",
				"\u2802",
				"\u2804",
				"\u2840",
				"\u2880",
				"\u2820",
				"\u2810",
				"\u2808",
			],
		},
		dots12: {
			interval: 80,
			frames: [
				"\u2880\u2800",
				"\u2840\u2800",
				"\u2804\u2800",
				"\u2882\u2800",
				"\u2842\u2800",
				"\u2805\u2800",
				"\u2883\u2800",
				"\u2843\u2800",
				"\u280D\u2800",
				"\u288B\u2800",
				"\u284B\u2800",
				"\u280D\u2801",
				"\u288B\u2801",
				"\u284B\u2801",
				"\u280D\u2809",
				"\u280B\u2809",
				"\u280B\u2809",
				"\u2809\u2819",
				"\u2809\u2819",
				"\u2809\u2829",
				"\u2808\u2899",
				"\u2808\u2859",
				"\u2888\u2829",
				"\u2840\u2899",
				"\u2804\u2859",
				"\u2882\u2829",
				"\u2842\u2898",
				"\u2805\u2858",
				"\u2883\u2828",
				"\u2843\u2890",
				"\u280D\u2850",
				"\u288B\u2820",
				"\u284B\u2880",
				"\u280D\u2841",
				"\u288B\u2801",
				"\u284B\u2801",
				"\u280D\u2809",
				"\u280B\u2809",
				"\u280B\u2809",
				"\u2809\u2819",
				"\u2809\u2819",
				"\u2809\u2829",
				"\u2808\u2899",
				"\u2808\u2859",
				"\u2808\u2829",
				"\u2800\u2899",
				"\u2800\u2859",
				"\u2800\u2829",
				"\u2800\u2898",
				"\u2800\u2858",
				"\u2800\u2828",
				"\u2800\u2890",
				"\u2800\u2850",
				"\u2800\u2820",
				"\u2800\u2880",
				"\u2800\u2840",
			],
		},
		dots13: {
			interval: 80,
			frames: [
				"\u28FC",
				"\u28F9",
				"\u28BB",
				"\u283F",
				"\u285F",
				"\u28CF",
				"\u28E7",
				"\u28F6",
			],
		},
		dots8Bit: {
			interval: 80,
			frames: [
				"\u2800",
				"\u2801",
				"\u2802",
				"\u2803",
				"\u2804",
				"\u2805",
				"\u2806",
				"\u2807",
				"\u2840",
				"\u2841",
				"\u2842",
				"\u2843",
				"\u2844",
				"\u2845",
				"\u2846",
				"\u2847",
				"\u2808",
				"\u2809",
				"\u280A",
				"\u280B",
				"\u280C",
				"\u280D",
				"\u280E",
				"\u280F",
				"\u2848",
				"\u2849",
				"\u284A",
				"\u284B",
				"\u284C",
				"\u284D",
				"\u284E",
				"\u284F",
				"\u2810",
				"\u2811",
				"\u2812",
				"\u2813",
				"\u2814",
				"\u2815",
				"\u2816",
				"\u2817",
				"\u2850",
				"\u2851",
				"\u2852",
				"\u2853",
				"\u2854",
				"\u2855",
				"\u2856",
				"\u2857",
				"\u2818",
				"\u2819",
				"\u281A",
				"\u281B",
				"\u281C",
				"\u281D",
				"\u281E",
				"\u281F",
				"\u2858",
				"\u2859",
				"\u285A",
				"\u285B",
				"\u285C",
				"\u285D",
				"\u285E",
				"\u285F",
				"\u2820",
				"\u2821",
				"\u2822",
				"\u2823",
				"\u2824",
				"\u2825",
				"\u2826",
				"\u2827",
				"\u2860",
				"\u2861",
				"\u2862",
				"\u2863",
				"\u2864",
				"\u2865",
				"\u2866",
				"\u2867",
				"\u2828",
				"\u2829",
				"\u282A",
				"\u282B",
				"\u282C",
				"\u282D",
				"\u282E",
				"\u282F",
				"\u2868",
				"\u2869",
				"\u286A",
				"\u286B",
				"\u286C",
				"\u286D",
				"\u286E",
				"\u286F",
				"\u2830",
				"\u2831",
				"\u2832",
				"\u2833",
				"\u2834",
				"\u2835",
				"\u2836",
				"\u2837",
				"\u2870",
				"\u2871",
				"\u2872",
				"\u2873",
				"\u2874",
				"\u2875",
				"\u2876",
				"\u2877",
				"\u2838",
				"\u2839",
				"\u283A",
				"\u283B",
				"\u283C",
				"\u283D",
				"\u283E",
				"\u283F",
				"\u2878",
				"\u2879",
				"\u287A",
				"\u287B",
				"\u287C",
				"\u287D",
				"\u287E",
				"\u287F",
				"\u2880",
				"\u2881",
				"\u2882",
				"\u2883",
				"\u2884",
				"\u2885",
				"\u2886",
				"\u2887",
				"\u28C0",
				"\u28C1",
				"\u28C2",
				"\u28C3",
				"\u28C4",
				"\u28C5",
				"\u28C6",
				"\u28C7",
				"\u2888",
				"\u2889",
				"\u288A",
				"\u288B",
				"\u288C",
				"\u288D",
				"\u288E",
				"\u288F",
				"\u28C8",
				"\u28C9",
				"\u28CA",
				"\u28CB",
				"\u28CC",
				"\u28CD",
				"\u28CE",
				"\u28CF",
				"\u2890",
				"\u2891",
				"\u2892",
				"\u2893",
				"\u2894",
				"\u2895",
				"\u2896",
				"\u2897",
				"\u28D0",
				"\u28D1",
				"\u28D2",
				"\u28D3",
				"\u28D4",
				"\u28D5",
				"\u28D6",
				"\u28D7",
				"\u2898",
				"\u2899",
				"\u289A",
				"\u289B",
				"\u289C",
				"\u289D",
				"\u289E",
				"\u289F",
				"\u28D8",
				"\u28D9",
				"\u28DA",
				"\u28DB",
				"\u28DC",
				"\u28DD",
				"\u28DE",
				"\u28DF",
				"\u28A0",
				"\u28A1",
				"\u28A2",
				"\u28A3",
				"\u28A4",
				"\u28A5",
				"\u28A6",
				"\u28A7",
				"\u28E0",
				"\u28E1",
				"\u28E2",
				"\u28E3",
				"\u28E4",
				"\u28E5",
				"\u28E6",
				"\u28E7",
				"\u28A8",
				"\u28A9",
				"\u28AA",
				"\u28AB",
				"\u28AC",
				"\u28AD",
				"\u28AE",
				"\u28AF",
				"\u28E8",
				"\u28E9",
				"\u28EA",
				"\u28EB",
				"\u28EC",
				"\u28ED",
				"\u28EE",
				"\u28EF",
				"\u28B0",
				"\u28B1",
				"\u28B2",
				"\u28B3",
				"\u28B4",
				"\u28B5",
				"\u28B6",
				"\u28B7",
				"\u28F0",
				"\u28F1",
				"\u28F2",
				"\u28F3",
				"\u28F4",
				"\u28F5",
				"\u28F6",
				"\u28F7",
				"\u28B8",
				"\u28B9",
				"\u28BA",
				"\u28BB",
				"\u28BC",
				"\u28BD",
				"\u28BE",
				"\u28BF",
				"\u28F8",
				"\u28F9",
				"\u28FA",
				"\u28FB",
				"\u28FC",
				"\u28FD",
				"\u28FE",
				"\u28FF",
			],
		},
		sand: {
			interval: 80,
			frames: [
				"\u2801",
				"\u2802",
				"\u2804",
				"\u2840",
				"\u2848",
				"\u2850",
				"\u2860",
				"\u28C0",
				"\u28C1",
				"\u28C2",
				"\u28C4",
				"\u28CC",
				"\u28D4",
				"\u28E4",
				"\u28E5",
				"\u28E6",
				"\u28EE",
				"\u28F6",
				"\u28F7",
				"\u28FF",
				"\u287F",
				"\u283F",
				"\u289F",
				"\u281F",
				"\u285B",
				"\u281B",
				"\u282B",
				"\u288B",
				"\u280B",
				"\u280D",
				"\u2849",
				"\u2809",
				"\u2811",
				"\u2821",
				"\u2881",
			],
		},
		line: { interval: 130, frames: ["-", "\\", "|", "/"] },
		line2: {
			interval: 100,
			frames: ["\u2802", "-", "\u2013", "\u2014", "\u2013", "-"],
		},
		pipe: {
			interval: 100,
			frames: [
				"\u2524",
				"\u2518",
				"\u2534",
				"\u2514",
				"\u251C",
				"\u250C",
				"\u252C",
				"\u2510",
			],
		},
		simpleDots: { interval: 400, frames: [".  ", ".. ", "...", "   "] },
		simpleDotsScrolling: {
			interval: 200,
			frames: [".  ", ".. ", "...", " ..", "  .", "   "],
		},
		star: {
			interval: 70,
			frames: ["\u2736", "\u2738", "\u2739", "\u273A", "\u2739", "\u2737"],
		},
		star2: { interval: 80, frames: ["+", "x", "*"] },
		flip: {
			interval: 70,
			frames: ["_", "_", "_", "-", "`", "`", "'", "\xB4", "-", "_", "_", "_"],
		},
		hamburger: { interval: 100, frames: ["\u2631", "\u2632", "\u2634"] },
		growVertical: {
			interval: 120,
			frames: [
				"\u2581",
				"\u2583",
				"\u2584",
				"\u2585",
				"\u2586",
				"\u2587",
				"\u2586",
				"\u2585",
				"\u2584",
				"\u2583",
			],
		},
		growHorizontal: {
			interval: 120,
			frames: [
				"\u258F",
				"\u258E",
				"\u258D",
				"\u258C",
				"\u258B",
				"\u258A",
				"\u2589",
				"\u258A",
				"\u258B",
				"\u258C",
				"\u258D",
				"\u258E",
			],
		},
		balloon: { interval: 140, frames: [" ", ".", "o", "O", "@", "*", " "] },
		balloon2: { interval: 120, frames: [".", "o", "O", "\xB0", "O", "o", "."] },
		noise: { interval: 100, frames: ["\u2593", "\u2592", "\u2591"] },
		bounce: { interval: 120, frames: ["\u2801", "\u2802", "\u2804", "\u2802"] },
		boxBounce: {
			interval: 120,
			frames: ["\u2596", "\u2598", "\u259D", "\u2597"],
		},
		boxBounce2: {
			interval: 100,
			frames: ["\u258C", "\u2580", "\u2590", "\u2584"],
		},
		triangle: {
			interval: 50,
			frames: ["\u25E2", "\u25E3", "\u25E4", "\u25E5"],
		},
		binary: {
			interval: 80,
			frames: [
				"010010",
				"001100",
				"100101",
				"111010",
				"111101",
				"010111",
				"101011",
				"111000",
				"110011",
				"110101",
			],
		},
		arc: {
			interval: 100,
			frames: ["\u25DC", "\u25E0", "\u25DD", "\u25DE", "\u25E1", "\u25DF"],
		},
		circle: { interval: 120, frames: ["\u25E1", "\u2299", "\u25E0"] },
		squareCorners: {
			interval: 180,
			frames: ["\u25F0", "\u25F3", "\u25F2", "\u25F1"],
		},
		circleQuarters: {
			interval: 120,
			frames: ["\u25F4", "\u25F7", "\u25F6", "\u25F5"],
		},
		circleHalves: {
			interval: 50,
			frames: ["\u25D0", "\u25D3", "\u25D1", "\u25D2"],
		},
		squish: { interval: 100, frames: ["\u256B", "\u256A"] },
		toggle: { interval: 250, frames: ["\u22B6", "\u22B7"] },
		toggle2: { interval: 80, frames: ["\u25AB", "\u25AA"] },
		toggle3: { interval: 120, frames: ["\u25A1", "\u25A0"] },
		toggle4: {
			interval: 100,
			frames: ["\u25A0", "\u25A1", "\u25AA", "\u25AB"],
		},
		toggle5: { interval: 100, frames: ["\u25AE", "\u25AF"] },
		toggle6: { interval: 300, frames: ["\u101D", "\u1040"] },
		toggle7: { interval: 80, frames: ["\u29BE", "\u29BF"] },
		toggle8: { interval: 100, frames: ["\u25CD", "\u25CC"] },
		toggle9: { interval: 100, frames: ["\u25C9", "\u25CE"] },
		toggle10: { interval: 100, frames: ["\u3282", "\u3280", "\u3281"] },
		toggle11: { interval: 50, frames: ["\u29C7", "\u29C6"] },
		toggle12: { interval: 120, frames: ["\u2617", "\u2616"] },
		toggle13: { interval: 80, frames: ["=", "*", "-"] },
		arrow: {
			interval: 100,
			frames: [
				"\u2190",
				"\u2196",
				"\u2191",
				"\u2197",
				"\u2192",
				"\u2198",
				"\u2193",
				"\u2199",
			],
		},
		arrow2: {
			interval: 80,
			frames: [
				"\u2B06\uFE0F ",
				"\u2197\uFE0F ",
				"\u27A1\uFE0F ",
				"\u2198\uFE0F ",
				"\u2B07\uFE0F ",
				"\u2199\uFE0F ",
				"\u2B05\uFE0F ",
				"\u2196\uFE0F ",
			],
		},
		arrow3: {
			interval: 120,
			frames: [
				"\u25B9\u25B9\u25B9\u25B9\u25B9",
				"\u25B8\u25B9\u25B9\u25B9\u25B9",
				"\u25B9\u25B8\u25B9\u25B9\u25B9",
				"\u25B9\u25B9\u25B8\u25B9\u25B9",
				"\u25B9\u25B9\u25B9\u25B8\u25B9",
				"\u25B9\u25B9\u25B9\u25B9\u25B8",
			],
		},
		bouncingBar: {
			interval: 80,
			frames: [
				"[    ]",
				"[=   ]",
				"[==  ]",
				"[=== ]",
				"[====]",
				"[ ===]",
				"[  ==]",
				"[   =]",
				"[    ]",
				"[   =]",
				"[  ==]",
				"[ ===]",
				"[====]",
				"[=== ]",
				"[==  ]",
				"[=   ]",
			],
		},
		bouncingBall: {
			interval: 80,
			frames: [
				"( \u25CF    )",
				"(  \u25CF   )",
				"(   \u25CF  )",
				"(    \u25CF )",
				"(     \u25CF)",
				"(    \u25CF )",
				"(   \u25CF  )",
				"(  \u25CF   )",
				"( \u25CF    )",
				"(\u25CF     )",
			],
		},
		smiley: { interval: 200, frames: ["\uD83D\uDE04 ", "\uD83D\uDE1D "] },
		monkey: {
			interval: 300,
			frames: [
				"\uD83D\uDE48 ",
				"\uD83D\uDE48 ",
				"\uD83D\uDE49 ",
				"\uD83D\uDE4A ",
			],
		},
		hearts: {
			interval: 100,
			frames: [
				"\uD83D\uDC9B ",
				"\uD83D\uDC99 ",
				"\uD83D\uDC9C ",
				"\uD83D\uDC9A ",
				"\u2764\uFE0F ",
			],
		},
		clock: {
			interval: 100,
			frames: [
				"\uD83D\uDD5B ",
				"\uD83D\uDD50 ",
				"\uD83D\uDD51 ",
				"\uD83D\uDD52 ",
				"\uD83D\uDD53 ",
				"\uD83D\uDD54 ",
				"\uD83D\uDD55 ",
				"\uD83D\uDD56 ",
				"\uD83D\uDD57 ",
				"\uD83D\uDD58 ",
				"\uD83D\uDD59 ",
				"\uD83D\uDD5A ",
			],
		},
		earth: {
			interval: 180,
			frames: ["\uD83C\uDF0D ", "\uD83C\uDF0E ", "\uD83C\uDF0F "],
		},
		material: {
			interval: 17,
			frames: [
				"\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588",
				"\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588",
				"\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588",
				"\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588",
				"\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588",
				"\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588",
				"\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588",
				"\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2588",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
				"\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581\u2581",
			],
		},
		moon: {
			interval: 80,
			frames: [
				"\uD83C\uDF11 ",
				"\uD83C\uDF12 ",
				"\uD83C\uDF13 ",
				"\uD83C\uDF14 ",
				"\uD83C\uDF15 ",
				"\uD83C\uDF16 ",
				"\uD83C\uDF17 ",
				"\uD83C\uDF18 ",
			],
		},
		runner: { interval: 140, frames: ["\uD83D\uDEB6 ", "\uD83C\uDFC3 "] },
		pong: {
			interval: 80,
			frames: [
				"\u2590\u2802       \u258C",
				"\u2590\u2808       \u258C",
				"\u2590 \u2802      \u258C",
				"\u2590 \u2820      \u258C",
				"\u2590  \u2840     \u258C",
				"\u2590  \u2820     \u258C",
				"\u2590   \u2802    \u258C",
				"\u2590   \u2808    \u258C",
				"\u2590    \u2802   \u258C",
				"\u2590    \u2820   \u258C",
				"\u2590     \u2840  \u258C",
				"\u2590     \u2820  \u258C",
				"\u2590      \u2802 \u258C",
				"\u2590      \u2808 \u258C",
				"\u2590       \u2802\u258C",
				"\u2590       \u2820\u258C",
				"\u2590       \u2840\u258C",
				"\u2590      \u2820 \u258C",
				"\u2590      \u2802 \u258C",
				"\u2590     \u2808  \u258C",
				"\u2590     \u2802  \u258C",
				"\u2590    \u2820   \u258C",
				"\u2590    \u2840   \u258C",
				"\u2590   \u2820    \u258C",
				"\u2590   \u2802    \u258C",
				"\u2590  \u2808     \u258C",
				"\u2590  \u2802     \u258C",
				"\u2590 \u2820      \u258C",
				"\u2590 \u2840      \u258C",
				"\u2590\u2820       \u258C",
			],
		},
		shark: {
			interval: 120,
			frames: [
				"\u2590|\\____________\u258C",
				"\u2590_|\\___________\u258C",
				"\u2590__|\\__________\u258C",
				"\u2590___|\\_________\u258C",
				"\u2590____|\\________\u258C",
				"\u2590_____|\\_______\u258C",
				"\u2590______|\\______\u258C",
				"\u2590_______|\\_____\u258C",
				"\u2590________|\\____\u258C",
				"\u2590_________|\\___\u258C",
				"\u2590__________|\\__\u258C",
				"\u2590___________|\\_\u258C",
				"\u2590____________|\\\u258C",
				"\u2590____________/|\u258C",
				"\u2590___________/|_\u258C",
				"\u2590__________/|__\u258C",
				"\u2590_________/|___\u258C",
				"\u2590________/|____\u258C",
				"\u2590_______/|_____\u258C",
				"\u2590______/|______\u258C",
				"\u2590_____/|_______\u258C",
				"\u2590____/|________\u258C",
				"\u2590___/|_________\u258C",
				"\u2590__/|__________\u258C",
				"\u2590_/|___________\u258C",
				"\u2590/|____________\u258C",
			],
		},
		dqpb: { interval: 100, frames: ["d", "q", "p", "b"] },
		weather: {
			interval: 100,
			frames: [
				"\u2600\uFE0F ",
				"\u2600\uFE0F ",
				"\u2600\uFE0F ",
				"\uD83C\uDF24 ",
				"\u26C5\uFE0F ",
				"\uD83C\uDF25 ",
				"\u2601\uFE0F ",
				"\uD83C\uDF27 ",
				"\uD83C\uDF28 ",
				"\uD83C\uDF27 ",
				"\uD83C\uDF28 ",
				"\uD83C\uDF27 ",
				"\uD83C\uDF28 ",
				"\u26C8 ",
				"\uD83C\uDF28 ",
				"\uD83C\uDF27 ",
				"\uD83C\uDF28 ",
				"\u2601\uFE0F ",
				"\uD83C\uDF25 ",
				"\u26C5\uFE0F ",
				"\uD83C\uDF24 ",
				"\u2600\uFE0F ",
				"\u2600\uFE0F ",
			],
		},
		christmas: { interval: 400, frames: ["\uD83C\uDF32", "\uD83C\uDF84"] },
		grenade: {
			interval: 80,
			frames: [
				"\u060C  ",
				"\u2032  ",
				" \xB4 ",
				" \u203E ",
				"  \u2E0C",
				"  \u2E0A",
				"  |",
				"  \u204E",
				"  \u2055",
				" \u0DF4 ",
				"  \u2053",
				"   ",
				"   ",
				"   ",
			],
		},
		point: {
			interval: 125,
			frames: [
				"\u2219\u2219\u2219",
				"\u25CF\u2219\u2219",
				"\u2219\u25CF\u2219",
				"\u2219\u2219\u25CF",
				"\u2219\u2219\u2219",
			],
		},
		layer: { interval: 150, frames: ["-", "=", "\u2261"] },
		betaWave: {
			interval: 80,
			frames: [
				"\u03C1\u03B2\u03B2\u03B2\u03B2\u03B2\u03B2",
				"\u03B2\u03C1\u03B2\u03B2\u03B2\u03B2\u03B2",
				"\u03B2\u03B2\u03C1\u03B2\u03B2\u03B2\u03B2",
				"\u03B2\u03B2\u03B2\u03C1\u03B2\u03B2\u03B2",
				"\u03B2\u03B2\u03B2\u03B2\u03C1\u03B2\u03B2",
				"\u03B2\u03B2\u03B2\u03B2\u03B2\u03C1\u03B2",
				"\u03B2\u03B2\u03B2\u03B2\u03B2\u03B2\u03C1",
			],
		},
		fingerDance: {
			interval: 160,
			frames: [
				"\uD83E\uDD18 ",
				"\uD83E\uDD1F ",
				"\uD83D\uDD96 ",
				"\u270B ",
				"\uD83E\uDD1A ",
				"\uD83D\uDC46 ",
			],
		},
		fistBump: {
			interval: 80,
			frames: [
				"\uD83E\uDD1C\u3000\u3000\u3000\u3000\uD83E\uDD1B ",
				"\uD83E\uDD1C\u3000\u3000\u3000\u3000\uD83E\uDD1B ",
				"\uD83E\uDD1C\u3000\u3000\u3000\u3000\uD83E\uDD1B ",
				"\u3000\uD83E\uDD1C\u3000\u3000\uD83E\uDD1B\u3000 ",
				"\u3000\u3000\uD83E\uDD1C\uD83E\uDD1B\u3000\u3000 ",
				"\u3000\uD83E\uDD1C\u2728\uD83E\uDD1B\u3000\u3000 ",
				"\uD83E\uDD1C\u3000\u2728\u3000\uD83E\uDD1B\u3000 ",
			],
		},
		soccerHeader: {
			interval: 80,
			frames: [
				" \uD83E\uDDD1\u26BD\uFE0F       \uD83E\uDDD1 ",
				"\uD83E\uDDD1  \u26BD\uFE0F      \uD83E\uDDD1 ",
				"\uD83E\uDDD1   \u26BD\uFE0F     \uD83E\uDDD1 ",
				"\uD83E\uDDD1    \u26BD\uFE0F    \uD83E\uDDD1 ",
				"\uD83E\uDDD1     \u26BD\uFE0F   \uD83E\uDDD1 ",
				"\uD83E\uDDD1      \u26BD\uFE0F  \uD83E\uDDD1 ",
				"\uD83E\uDDD1       \u26BD\uFE0F\uD83E\uDDD1  ",
				"\uD83E\uDDD1      \u26BD\uFE0F  \uD83E\uDDD1 ",
				"\uD83E\uDDD1     \u26BD\uFE0F   \uD83E\uDDD1 ",
				"\uD83E\uDDD1    \u26BD\uFE0F    \uD83E\uDDD1 ",
				"\uD83E\uDDD1   \u26BD\uFE0F     \uD83E\uDDD1 ",
				"\uD83E\uDDD1  \u26BD\uFE0F      \uD83E\uDDD1 ",
			],
		},
		mindblown: {
			interval: 160,
			frames: [
				"\uD83D\uDE10 ",
				"\uD83D\uDE10 ",
				"\uD83D\uDE2E ",
				"\uD83D\uDE2E ",
				"\uD83D\uDE26 ",
				"\uD83D\uDE26 ",
				"\uD83D\uDE27 ",
				"\uD83D\uDE27 ",
				"\uD83E\uDD2F ",
				"\uD83D\uDCA5 ",
				"\u2728 ",
				"\u3000 ",
				"\u3000 ",
				"\u3000 ",
			],
		},
		speaker: {
			interval: 160,
			frames: [
				"\uD83D\uDD08 ",
				"\uD83D\uDD09 ",
				"\uD83D\uDD0A ",
				"\uD83D\uDD09 ",
			],
		},
		orangePulse: {
			interval: 100,
			frames: [
				"\uD83D\uDD38 ",
				"\uD83D\uDD36 ",
				"\uD83D\uDFE0 ",
				"\uD83D\uDFE0 ",
				"\uD83D\uDD36 ",
			],
		},
		bluePulse: {
			interval: 100,
			frames: [
				"\uD83D\uDD39 ",
				"\uD83D\uDD37 ",
				"\uD83D\uDD35 ",
				"\uD83D\uDD35 ",
				"\uD83D\uDD37 ",
			],
		},
		orangeBluePulse: {
			interval: 100,
			frames: [
				"\uD83D\uDD38 ",
				"\uD83D\uDD36 ",
				"\uD83D\uDFE0 ",
				"\uD83D\uDFE0 ",
				"\uD83D\uDD36 ",
				"\uD83D\uDD39 ",
				"\uD83D\uDD37 ",
				"\uD83D\uDD35 ",
				"\uD83D\uDD35 ",
				"\uD83D\uDD37 ",
			],
		},
		timeTravel: {
			interval: 100,
			frames: [
				"\uD83D\uDD5B ",
				"\uD83D\uDD5A ",
				"\uD83D\uDD59 ",
				"\uD83D\uDD58 ",
				"\uD83D\uDD57 ",
				"\uD83D\uDD56 ",
				"\uD83D\uDD55 ",
				"\uD83D\uDD54 ",
				"\uD83D\uDD53 ",
				"\uD83D\uDD52 ",
				"\uD83D\uDD51 ",
				"\uD83D\uDD50 ",
			],
		},
		aesthetic: {
			interval: 80,
			frames: [
				"\u25B0\u25B1\u25B1\u25B1\u25B1\u25B1\u25B1",
				"\u25B0\u25B0\u25B1\u25B1\u25B1\u25B1\u25B1",
				"\u25B0\u25B0\u25B0\u25B1\u25B1\u25B1\u25B1",
				"\u25B0\u25B0\u25B0\u25B0\u25B1\u25B1\u25B1",
				"\u25B0\u25B0\u25B0\u25B0\u25B0\u25B1\u25B1",
				"\u25B0\u25B0\u25B0\u25B0\u25B0\u25B0\u25B1",
				"\u25B0\u25B0\u25B0\u25B0\u25B0\u25B0\u25B0",
				"\u25B0\u25B1\u25B1\u25B1\u25B1\u25B1\u25B1",
			],
		},
		dwarfFortress: {
			interval: 80,
			frames: [
				" \u2588\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"\u263A\u2588\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"\u263A\u2588\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"\u263A\u2593\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"\u263A\u2593\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"\u263A\u2592\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"\u263A\u2592\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"\u263A\u2591\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"\u263A\u2591\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"\u263A \u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u263A\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u263A\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u263A\u2593\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u263A\u2593\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u263A\u2592\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u263A\u2592\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u263A\u2591\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u263A\u2591\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u263A \u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u263A\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u263A\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u263A\u2593\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u263A\u2593\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u263A\u2592\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u263A\u2592\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u263A\u2591\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u263A\u2591\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u263A \u2588\u2588\u2588\xA3\xA3\xA3  ",
				"   \u263A\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"   \u263A\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"   \u263A\u2593\u2588\u2588\xA3\xA3\xA3  ",
				"   \u263A\u2593\u2588\u2588\xA3\xA3\xA3  ",
				"   \u263A\u2592\u2588\u2588\xA3\xA3\xA3  ",
				"   \u263A\u2592\u2588\u2588\xA3\xA3\xA3  ",
				"   \u263A\u2591\u2588\u2588\xA3\xA3\xA3  ",
				"   \u263A\u2591\u2588\u2588\xA3\xA3\xA3  ",
				"   \u263A \u2588\u2588\xA3\xA3\xA3  ",
				"    \u263A\u2588\u2588\xA3\xA3\xA3  ",
				"    \u263A\u2588\u2588\xA3\xA3\xA3  ",
				"    \u263A\u2593\u2588\xA3\xA3\xA3  ",
				"    \u263A\u2593\u2588\xA3\xA3\xA3  ",
				"    \u263A\u2592\u2588\xA3\xA3\xA3  ",
				"    \u263A\u2592\u2588\xA3\xA3\xA3  ",
				"    \u263A\u2591\u2588\xA3\xA3\xA3  ",
				"    \u263A\u2591\u2588\xA3\xA3\xA3  ",
				"    \u263A \u2588\xA3\xA3\xA3  ",
				"     \u263A\u2588\xA3\xA3\xA3  ",
				"     \u263A\u2588\xA3\xA3\xA3  ",
				"     \u263A\u2593\xA3\xA3\xA3  ",
				"     \u263A\u2593\xA3\xA3\xA3  ",
				"     \u263A\u2592\xA3\xA3\xA3  ",
				"     \u263A\u2592\xA3\xA3\xA3  ",
				"     \u263A\u2591\xA3\xA3\xA3  ",
				"     \u263A\u2591\xA3\xA3\xA3  ",
				"     \u263A \xA3\xA3\xA3  ",
				"      \u263A\xA3\xA3\xA3  ",
				"      \u263A\xA3\xA3\xA3  ",
				"      \u263A\u2593\xA3\xA3  ",
				"      \u263A\u2593\xA3\xA3  ",
				"      \u263A\u2592\xA3\xA3  ",
				"      \u263A\u2592\xA3\xA3  ",
				"      \u263A\u2591\xA3\xA3  ",
				"      \u263A\u2591\xA3\xA3  ",
				"      \u263A \xA3\xA3  ",
				"       \u263A\xA3\xA3  ",
				"       \u263A\xA3\xA3  ",
				"       \u263A\u2593\xA3  ",
				"       \u263A\u2593\xA3  ",
				"       \u263A\u2592\xA3  ",
				"       \u263A\u2592\xA3  ",
				"       \u263A\u2591\xA3  ",
				"       \u263A\u2591\xA3  ",
				"       \u263A \xA3  ",
				"        \u263A\xA3  ",
				"        \u263A\xA3  ",
				"        \u263A\u2593  ",
				"        \u263A\u2593  ",
				"        \u263A\u2592  ",
				"        \u263A\u2592  ",
				"        \u263A\u2591  ",
				"        \u263A\u2591  ",
				"        \u263A   ",
				"        \u263A  &",
				"        \u263A \u263C&",
				"       \u263A \u263C &",
				"       \u263A\u263C  &",
				"      \u263A\u263C  & ",
				"      \u203C   & ",
				"     \u263A   &  ",
				"    \u203C    &  ",
				"   \u263A    &   ",
				"  \u203C     &   ",
				" \u263A     &    ",
				"\u203C      &    ",
				"      &     ",
				"      &     ",
				"     &   \u2591  ",
				"     &   \u2592  ",
				"    &    \u2593  ",
				"    &    \xA3  ",
				"   &    \u2591\xA3  ",
				"   &    \u2592\xA3  ",
				"  &     \u2593\xA3  ",
				"  &     \xA3\xA3  ",
				" &     \u2591\xA3\xA3  ",
				" &     \u2592\xA3\xA3  ",
				"&      \u2593\xA3\xA3  ",
				"&      \xA3\xA3\xA3  ",
				"      \u2591\xA3\xA3\xA3  ",
				"      \u2592\xA3\xA3\xA3  ",
				"      \u2593\xA3\xA3\xA3  ",
				"      \u2588\xA3\xA3\xA3  ",
				"     \u2591\u2588\xA3\xA3\xA3  ",
				"     \u2592\u2588\xA3\xA3\xA3  ",
				"     \u2593\u2588\xA3\xA3\xA3  ",
				"     \u2588\u2588\xA3\xA3\xA3  ",
				"    \u2591\u2588\u2588\xA3\xA3\xA3  ",
				"    \u2592\u2588\u2588\xA3\xA3\xA3  ",
				"    \u2593\u2588\u2588\xA3\xA3\xA3  ",
				"    \u2588\u2588\u2588\xA3\xA3\xA3  ",
				"   \u2591\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"   \u2592\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"   \u2593\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"   \u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u2591\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u2592\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u2593\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				"  \u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u2591\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u2592\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u2593\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u2588\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
				" \u2588\u2588\u2588\u2588\u2588\u2588\xA3\xA3\xA3  ",
			],
		},
	};
});
var J4 = W((Uu, lX) => {
	var G8 = Object.assign({}, mX()),
		hX = Object.keys(G8);
	Object.defineProperty(G8, "random", {
		get() {
			let D = Math.floor(Math.random() * hX.length),
				F = hX[D];
			return G8[F];
		},
	});
	lX.exports = G8;
});
var p4 = s0(c4(), 1),
	{
		program: IP,
		createCommand: UP,
		createArgument: MP,
		createOption: RP,
		CommanderError: PP,
		InvalidArgumentError: TP,
		InvalidOptionArgumentError: OP,
		Command: a4,
		Argument: wP,
		Option: jP,
		Help: uP,
	} = p4.default;
var g0 = {
	CONFIGS: {
		NAME: "configs_name",
		PACKAGE: "configs_package",
		DIR: "configs_dir",
	},
	COMMAND: {
		PACKAGE_NAME: "command_package_name",
		BOILERPLATE: "command_boilerplate",
		INSTALL_DEPENDENCY: "command_install_dependency",
	},
};
var i4 = new Map(),
	v0 = (D, F) => {
		i4.set(D, F);
	};
var s4 = () => {
	i4.clear();
};
var Z0 = {
	PROGRAM: {
		ERROR_RUN: "Error running command",
		VERSION_DESCRIPTION: "Output the current version",
		MAKE_DESCRIPTION: "Create a pattern file for project",
		CREATE_DESCRIPTION: "Create a new project",
		CANCELED: "Operation cancelled.",
	},
};
import qB from "fs";
import YK from "path";
var b8 = {
	name: "lokio-assistant",
	version: "0.0.1",
	author: {
		name: "wahyu agus arifin",
		email: "itpohgero@gmail.com",
		url: "https://github.com/itpohgero",
	},
	license: "MIT",
	type: "module",
	main: "./bin/index.js",
	types: "./bin/index.d.ts",
	bin: { lokio: "./bin/index.js" },
	engines: { node: ">=18.0.0", bun: ">=1.0.0" },
	scripts: {
		format: "bun run biome:format && bun run biome:check && bun run biome:lint",
		"biome:format": "bunx biome format --write .",
		"biome:check": "bunx biome check --write .",
		"biome:lint": "bunx biome lint --write .",
	},
	files: ["cmd/", "bin/index.ts"],
	devDependencies: { "@biomejs/biome": "1.9.4", "@types/bun": "^1.2.2" },
	peerDependencies: { typescript: "^5.0.0" },
	dependencies: {
		"@bluwy/giget-core": "^0.1.2",
		"@clack/prompts": "^0.9.1",
		chalk: "^5.4.1",
		commander: "^13.1.0",
		"log-update": "^6.1.0",
		ora: "^8.1.1",
		yaml: "^2.7.0",
	},
	keywords: [
		"lokio",
		"project-generator",
		"scaffolding",
		"development-tools",
		"mataramandev",
		"wahyu-agus-arifin",
		"itpohgero",
	],
	repository: {
		type: "git",
		url: "git+https://github.com/any-source/lokio.git",
	},
	bugs: { url: "https://github.com/any-source/lokio/issues" },
	homepage: "https://lokio.dev",
	publishConfig: { access: "public" },
};
var X0 = {
	NAME: "lokio",
	VERSION: b8.version,
	AUTHOR: b8.author.name,
	TAGLINE: "Structuring Code, One Command at a Time",
	CONFIG_FILE_NAME: ".lokio.yaml",
	GUTHUB: {
		LOKIO_TEMPLATE: "https://github.com/any-source/examples/tarball/main",
		LOKIO_GITHUB_URL:
			"https://raw.githubusercontent.com/any-source/examples/main",
	},
};
var ZB = s0($B(), 1),
	XB = () => {
		let D = YK.join(process.cwd(), X0.CONFIG_FILE_NAME);
		if (!qB.existsSync(D))
			return { exist: !1, data: { name: null, package: null, dir: {} } };
		let F = qB.readFileSync(D, "utf8"),
			_ = ZB.default.parse(F);
		return {
			exist: !0,
			data: {
				name: _.name || null,
				package: _.package || null,
				dir: {
					hook: _.dir?.hook || null,
					shared: _.dir?.shared || null,
					call: _.dir?.call || null,
					component: _.dir?.component || null,
					screen: _.dir?.screen || null,
					layout: _.dir?.layout || null,
					feature: _.dir?.feature || null,
					controller: _.dir?.controller || null,
					middleware: _.dir?.middleware || null,
					service: _.dir?.service || null,
					schema: _.dir?.schema || null,
				},
			},
		};
	};
var QB = [
	{
		value: "react",
		label: "React",
		hint: "The heart of modern frontend development.",
		children: [
			{
				value: "next-monolith",
				label: "[MN] - Monolith NextJs",
				hint: "Monolithic architecture, modern speed.",
				status: !0,
				lang: "ts",
			},
			{
				value: "next-frontend",
				label: "[FE] - Frontend NextJs",
				hint: "Cutting-edge frontend, simplified.",
				status: !1,
				lang: "ts",
			},
		],
	},
	{
		value: "bun",
		label: "Bun",
		hint: "Modern, fast, all-in-one JS runtime.",
		children: [
			{
				value: "hono-backend",
				label: "[BE] - Hono Backend",
				hint: "Lightning-fast backend for modern apps.",
				status: !1,
				lang: "ts",
			},
			{
				value: "elysia-backend",
				label: "[BE] - Elysia Backend",
				hint: "Elegant, modern, and developer-friendly.",
				status: !1,
				lang: "ts",
			},
		],
	},
	{
		value: "golang",
		label: "Golang",
		hint: "Powerful, efficient, and secure.",
		children: [
			{
				value: "go-backend",
				label: "[BE] - Golang Backend",
				hint: "Lightning-fast backend for modern apps.",
				status: !0,
				lang: "go",
			},
		],
	},
	{
		value: "kotlin",
		label: "Kotlin",
		hint: "The future of Android development.",
		children: [
			{
				value: "kt-mobile-compose-mvvm",
				label: "[MB] - Kotlin Mobile MVVM",
				hint: "Kotlin MVVM for mobile apps",
				status: !0,
				lang: "kt",
			},
		],
	},
];
import { stdout as kK } from "process";
import { platform as IK } from "os";
var UK = { enabled: IK() !== "win32" },
	nD = () => !UK.enabled,
	U1 = (D) => new Promise((F) => setTimeout(F, D)),
	a6 = (D, F) => Math.floor(Math.random() * (F - D + 1) + D),
	M1 = (...D) => {
		let F = D.flat(1);
		return F[Math.floor(F.length * Math.random())];
	},
	i6 = (D) => {
		let F = [
				"[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
				"(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))",
			].join("|"),
			_ = new RegExp(F, "g");
		return typeof D === "string" ? D.replace(_, "") : D;
	},
	MK = process.stdout,
	q0 = (D) =>
		MK.write(`${D}
`);
var { sleep: fK } = globalThis.Bun;
var JB =
		(D = 0) =>
		(F) =>
			`\x1B[${F + D}m`,
	zB =
		(D = 0) =>
		(F) =>
			`\x1B[${38 + D};5;${F}m`,
	AB =
		(D = 0) =>
		(F, _, B) =>
			`\x1B[${38 + D};2;${F};${_};${B}m`,
	k = {
		modifier: {
			reset: [0, 0],
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			overline: [53, 55],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29],
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			blackBright: [90, 39],
			gray: [90, 39],
			grey: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39],
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],
			bgBlackBright: [100, 49],
			bgGray: [100, 49],
			bgGrey: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49],
		},
	},
	QO = Object.keys(k.modifier),
	RK = Object.keys(k.color),
	PK = Object.keys(k.bgColor),
	JO = [...RK, ...PK];
function TK() {
	let D = new Map();
	for (let [F, _] of Object.entries(k)) {
		for (let [B, $] of Object.entries(_))
			(k[B] = { open: `\x1B[${$[0]}m`, close: `\x1B[${$[1]}m` }),
				(_[B] = k[B]),
				D.set($[0], $[1]);
		Object.defineProperty(k, F, { value: _, enumerable: !1 });
	}
	return (
		Object.defineProperty(k, "codes", { value: D, enumerable: !1 }),
		(k.color.close = "\x1B[39m"),
		(k.bgColor.close = "\x1B[49m"),
		(k.color.ansi = JB()),
		(k.color.ansi256 = zB()),
		(k.color.ansi16m = AB()),
		(k.bgColor.ansi = JB(10)),
		(k.bgColor.ansi256 = zB(10)),
		(k.bgColor.ansi16m = AB(10)),
		Object.defineProperties(k, {
			rgbToAnsi256: {
				value(F, _, B) {
					if (F === _ && _ === B) {
						if (F < 8) return 16;
						if (F > 248) return 231;
						return Math.round(((F - 8) / 247) * 24) + 232;
					}
					return (
						16 +
						36 * Math.round((F / 255) * 5) +
						6 * Math.round((_ / 255) * 5) +
						Math.round((B / 255) * 5)
					);
				},
				enumerable: !1,
			},
			hexToRgb: {
				value(F) {
					let _ = /[a-f\d]{6}|[a-f\d]{3}/i.exec(F.toString(16));
					if (!_) return [0, 0, 0];
					let [B] = _;
					if (B.length === 3) B = [...B].map((Z) => Z + Z).join("");
					let $ = Number.parseInt(B, 16);
					return [($ >> 16) & 255, ($ >> 8) & 255, $ & 255];
				},
				enumerable: !1,
			},
			hexToAnsi256: {
				value: (F) => k.rgbToAnsi256(...k.hexToRgb(F)),
				enumerable: !1,
			},
			ansi256ToAnsi: {
				value(F) {
					if (F < 8) return 30 + F;
					if (F < 16) return 90 + (F - 8);
					let _, B, $;
					if (F >= 232) (_ = ((F - 232) * 10 + 8) / 255), (B = _), ($ = _);
					else {
						F -= 16;
						let X = F % 36;
						(_ = Math.floor(F / 36) / 5),
							(B = Math.floor(X / 6) / 5),
							($ = (X % 6) / 5);
					}
					let Z = Math.max(_, B, $) * 2;
					if (Z === 0) return 30;
					let q =
						30 + ((Math.round($) << 2) | (Math.round(B) << 1) | Math.round(_));
					if (Z === 2) q += 60;
					return q;
				},
				enumerable: !1,
			},
			rgbToAnsi: {
				value: (F, _, B) => k.ansi256ToAnsi(k.rgbToAnsi256(F, _, B)),
				enumerable: !1,
			},
			hexToAnsi: {
				value: (F) => k.ansi256ToAnsi(k.hexToAnsi256(F)),
				enumerable: !1,
			},
		}),
		k
	);
}
var OK = TK(),
	j0 = OK;
import s6 from "process";
import wK from "os";
import LB from "tty";
function Y0(D, F = globalThis.Deno ? globalThis.Deno.args : s6.argv) {
	let _ = D.startsWith("-") ? "" : D.length === 1 ? "-" : "--",
		B = F.indexOf(_ + D),
		$ = F.indexOf("--");
	return B !== -1 && ($ === -1 || B < $);
}
var { env: h } = s6,
	rF;
if (Y0("no-color") || Y0("no-colors") || Y0("color=false") || Y0("color=never"))
	rF = 0;
else if (Y0("color") || Y0("colors") || Y0("color=true") || Y0("color=always"))
	rF = 1;
function jK() {
	if ("FORCE_COLOR" in h) {
		if (h.FORCE_COLOR === "true") return 1;
		if (h.FORCE_COLOR === "false") return 0;
		return h.FORCE_COLOR.length === 0
			? 1
			: Math.min(Number.parseInt(h.FORCE_COLOR, 10), 3);
	}
}
function uK(D) {
	if (D === 0) return !1;
	return { level: D, hasBasic: !0, has256: D >= 2, has16m: D >= 3 };
}
function NK(D, { streamIsTTY: F, sniffFlags: _ = !0 } = {}) {
	let B = jK();
	if (B !== void 0) rF = B;
	let $ = _ ? rF : B;
	if ($ === 0) return 0;
	if (_) {
		if (Y0("color=16m") || Y0("color=full") || Y0("color=truecolor")) return 3;
		if (Y0("color=256")) return 2;
	}
	if ("TF_BUILD" in h && "AGENT_NAME" in h) return 1;
	if (D && !F && $ === void 0) return 0;
	let Z = $ || 0;
	if (h.TERM === "dumb") return Z;
	if (s6.platform === "win32") {
		let q = wK.release().split(".");
		if (Number(q[0]) >= 10 && Number(q[2]) >= 10586)
			return Number(q[2]) >= 14931 ? 3 : 2;
		return 1;
	}
	if ("CI" in h) {
		if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((q) => q in h))
			return 3;
		if (
			["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some(
				(q) => q in h,
			) ||
			h.CI_NAME === "codeship"
		)
			return 1;
		return Z;
	}
	if ("TEAMCITY_VERSION" in h)
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(h.TEAMCITY_VERSION) ? 1 : 0;
	if (h.COLORTERM === "truecolor") return 3;
	if (h.TERM === "xterm-kitty") return 3;
	if ("TERM_PROGRAM" in h) {
		let q = Number.parseInt((h.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
		switch (h.TERM_PROGRAM) {
			case "iTerm.app":
				return q >= 3 ? 3 : 2;
			case "Apple_Terminal":
				return 2;
		}
	}
	if (/-256(color)?$/i.test(h.TERM)) return 2;
	if (
		/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(h.TERM)
	)
		return 1;
	if ("COLORTERM" in h) return 1;
	return Z;
}
function GB(D, F = {}) {
	let _ = NK(D, { streamIsTTY: D && D.isTTY, ...F });
	return uK(_);
}
var SK = {
		stdout: GB({ isTTY: LB.isatty(1) }),
		stderr: GB({ isTTY: LB.isatty(2) }),
	},
	VB = SK;
function CB(D, F, _) {
	let B = D.indexOf(F);
	if (B === -1) return D;
	let $ = F.length,
		Z = 0,
		q = "";
	do (q += D.slice(Z, B) + F + _), (Z = B + $), (B = D.indexOf(F, Z));
	while (B !== -1);
	return (q += D.slice(Z)), q;
}
function WB(D, F, _, B) {
	let $ = 0,
		Z = "";
	do {
		let q = D[B - 1] === "\r";
		(Z +=
			D.slice($, q ? B - 1 : B) +
			F +
			(q
				? `\r
`
				: `
`) +
			_),
			($ = B + 1),
			(B = D.indexOf(
				`
`,
				$,
			));
	} while (B !== -1);
	return (Z += D.slice($)), Z;
}
var { stdout: HB, stderr: KB } = VB,
	r6 = Symbol("GENERATOR"),
	I2 = Symbol("STYLER"),
	R1 = Symbol("IS_EMPTY"),
	YB = ["ansi", "ansi", "ansi256", "ansi16m"],
	U2 = Object.create(null),
	EK = (D, F = {}) => {
		if (F.level && !(Number.isInteger(F.level) && F.level >= 0 && F.level <= 3))
			throw new Error("The `level` option should be an integer from 0 to 3");
		let _ = HB ? HB.level : 0;
		D.level = F.level === void 0 ? _ : F.level;
	};
var xK = (D) => {
	let F = (..._) => _.join(" ");
	return EK(F, D), Object.setPrototypeOf(F, P1.prototype), F;
};
function P1(D) {
	return xK(D);
}
Object.setPrototypeOf(P1.prototype, Function.prototype);
for (let [D, F] of Object.entries(j0))
	U2[D] = {
		get() {
			let _ = nF(this, o6(F.open, F.close, this[I2]), this[R1]);
			return Object.defineProperty(this, D, { value: _ }), _;
		},
	};
U2.visible = {
	get() {
		let D = nF(this, this[I2], !0);
		return Object.defineProperty(this, "visible", { value: D }), D;
	},
};
var n6 = (D, F, _, ...B) => {
		if (D === "rgb") {
			if (F === "ansi16m") return j0[_].ansi16m(...B);
			if (F === "ansi256") return j0[_].ansi256(j0.rgbToAnsi256(...B));
			return j0[_].ansi(j0.rgbToAnsi(...B));
		}
		if (D === "hex") return n6("rgb", F, _, ...j0.hexToRgb(...B));
		return j0[_][D](...B);
	},
	bK = ["rgb", "hex", "ansi256"];
for (let D of bK) {
	U2[D] = {
		get() {
			let { level: _ } = this;
			return function (...B) {
				let $ = o6(n6(D, YB[_], "color", ...B), j0.color.close, this[I2]);
				return nF(this, $, this[R1]);
			};
		},
	};
	let F = "bg" + D[0].toUpperCase() + D.slice(1);
	U2[F] = {
		get() {
			let { level: _ } = this;
			return function (...B) {
				let $ = o6(n6(D, YB[_], "bgColor", ...B), j0.bgColor.close, this[I2]);
				return nF(this, $, this[R1]);
			};
		},
	};
}
var gK = Object.defineProperties(() => {}, {
		...U2,
		level: {
			enumerable: !0,
			get() {
				return this[r6].level;
			},
			set(D) {
				this[r6].level = D;
			},
		},
	}),
	o6 = (D, F, _) => {
		let B, $;
		if (_ === void 0) (B = D), ($ = F);
		else (B = _.openAll + D), ($ = F + _.closeAll);
		return { open: D, close: F, openAll: B, closeAll: $, parent: _ };
	},
	nF = (D, F, _) => {
		let B = (...$) => vK(B, $.length === 1 ? "" + $[0] : $.join(" "));
		return (
			Object.setPrototypeOf(B, gK), (B[r6] = D), (B[I2] = F), (B[R1] = _), B
		);
	},
	vK = (D, F) => {
		if (D.level <= 0 || !F) return D[R1] ? "" : F;
		let _ = D[I2];
		if (_ === void 0) return F;
		let { openAll: B, closeAll: $ } = _;
		if (F.includes("\x1B"))
			while (_ !== void 0) (F = CB(F, _.close, _.open)), (_ = _.parent);
		let Z = F.indexOf(`
`);
		if (Z !== -1) F = WB(F, $, B, Z);
		return B + F + $;
	};
Object.defineProperties(P1.prototype, U2);
var yK = P1(),
	YO = P1({ level: KB ? KB.level : 0 });
var U = yK;
var f0 = async (D, F) => {
	if ((await fK(100), kK.columns < 80))
		q0(`${U.cyan("\u25FC")}  ${U.cyan(D)}`), q0(`${" ".repeat(9)}${U.dim(F)}`);
	else q0(`${U.cyan("\u25FC")}  ${U.cyan(D)} ${U.dim(F)}`);
};
var oF = (D, F = U.bgHex("#f58b3b"), _ = U.black) => F(` ${_(D)} `);
import { stdout as mK } from "process";
var { sleep: hK } = globalThis.Bun;
var IB = async (D, F) => {
	if ((await hK(100), mK.columns < 80))
		q0(`${U.red("\u25FC")}  ${U.red(D)}`), q0(`${" ".repeat(9)}${U.dim(F)}`);
	else q0(`${U.red("\u25FC")}  ${U.red(D)} ${U.dim(F)}`);
};
var V0 = s0(e6(), 1);
import { stdin as iK, stdout as sK } from "process";
var EB = s0(F7(), 1);
import PB from "readline";
import { WriteStream as rK } from "tty";
function nK({ onlyFirst: D = !1 } = {}) {
	let F = [
		"[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))",
		"(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
	].join("|");
	return new RegExp(F, D ? void 0 : "g");
}
var oK = nK();
function xB(D) {
	if (typeof D != "string")
		throw new TypeError(`Expected a \`string\`, got \`${typeof D}\``);
	return D.replace(oK, "");
}
function bB(D) {
	return D && D.__esModule && Object.prototype.hasOwnProperty.call(D, "default")
		? D.default
		: D;
}
var gB = { exports: {} };
(function (D) {
	var F = {};
	(D.exports = F),
		(F.eastAsianWidth = function (B) {
			var $ = B.charCodeAt(0),
				Z = B.length == 2 ? B.charCodeAt(1) : 0,
				q = $;
			return (
				55296 <= $ &&
					$ <= 56319 &&
					56320 <= Z &&
					Z <= 57343 &&
					(($ &= 1023), (Z &= 1023), (q = ($ << 10) | Z), (q += 65536)),
				q == 12288 || (65281 <= q && q <= 65376) || (65504 <= q && q <= 65510)
					? "F"
					: q == 8361 ||
							(65377 <= q && q <= 65470) ||
							(65474 <= q && q <= 65479) ||
							(65482 <= q && q <= 65487) ||
							(65490 <= q && q <= 65495) ||
							(65498 <= q && q <= 65500) ||
							(65512 <= q && q <= 65518)
						? "H"
						: (4352 <= q && q <= 4447) ||
								(4515 <= q && q <= 4519) ||
								(4602 <= q && q <= 4607) ||
								(9001 <= q && q <= 9002) ||
								(11904 <= q && q <= 11929) ||
								(11931 <= q && q <= 12019) ||
								(12032 <= q && q <= 12245) ||
								(12272 <= q && q <= 12283) ||
								(12289 <= q && q <= 12350) ||
								(12353 <= q && q <= 12438) ||
								(12441 <= q && q <= 12543) ||
								(12549 <= q && q <= 12589) ||
								(12593 <= q && q <= 12686) ||
								(12688 <= q && q <= 12730) ||
								(12736 <= q && q <= 12771) ||
								(12784 <= q && q <= 12830) ||
								(12832 <= q && q <= 12871) ||
								(12880 <= q && q <= 13054) ||
								(13056 <= q && q <= 19903) ||
								(19968 <= q && q <= 42124) ||
								(42128 <= q && q <= 42182) ||
								(43360 <= q && q <= 43388) ||
								(44032 <= q && q <= 55203) ||
								(55216 <= q && q <= 55238) ||
								(55243 <= q && q <= 55291) ||
								(63744 <= q && q <= 64255) ||
								(65040 <= q && q <= 65049) ||
								(65072 <= q && q <= 65106) ||
								(65108 <= q && q <= 65126) ||
								(65128 <= q && q <= 65131) ||
								(110592 <= q && q <= 110593) ||
								(127488 <= q && q <= 127490) ||
								(127504 <= q && q <= 127546) ||
								(127552 <= q && q <= 127560) ||
								(127568 <= q && q <= 127569) ||
								(131072 <= q && q <= 194367) ||
								(177984 <= q && q <= 196605) ||
								(196608 <= q && q <= 262141)
							? "W"
							: (32 <= q && q <= 126) ||
									(162 <= q && q <= 163) ||
									(165 <= q && q <= 166) ||
									q == 172 ||
									q == 175 ||
									(10214 <= q && q <= 10221) ||
									(10629 <= q && q <= 10630)
								? "Na"
								: q == 161 ||
										q == 164 ||
										(167 <= q && q <= 168) ||
										q == 170 ||
										(173 <= q && q <= 174) ||
										(176 <= q && q <= 180) ||
										(182 <= q && q <= 186) ||
										(188 <= q && q <= 191) ||
										q == 198 ||
										q == 208 ||
										(215 <= q && q <= 216) ||
										(222 <= q && q <= 225) ||
										q == 230 ||
										(232 <= q && q <= 234) ||
										(236 <= q && q <= 237) ||
										q == 240 ||
										(242 <= q && q <= 243) ||
										(247 <= q && q <= 250) ||
										q == 252 ||
										q == 254 ||
										q == 257 ||
										q == 273 ||
										q == 275 ||
										q == 283 ||
										(294 <= q && q <= 295) ||
										q == 299 ||
										(305 <= q && q <= 307) ||
										q == 312 ||
										(319 <= q && q <= 322) ||
										q == 324 ||
										(328 <= q && q <= 331) ||
										q == 333 ||
										(338 <= q && q <= 339) ||
										(358 <= q && q <= 359) ||
										q == 363 ||
										q == 462 ||
										q == 464 ||
										q == 466 ||
										q == 468 ||
										q == 470 ||
										q == 472 ||
										q == 474 ||
										q == 476 ||
										q == 593 ||
										q == 609 ||
										q == 708 ||
										q == 711 ||
										(713 <= q && q <= 715) ||
										q == 717 ||
										q == 720 ||
										(728 <= q && q <= 731) ||
										q == 733 ||
										q == 735 ||
										(768 <= q && q <= 879) ||
										(913 <= q && q <= 929) ||
										(931 <= q && q <= 937) ||
										(945 <= q && q <= 961) ||
										(963 <= q && q <= 969) ||
										q == 1025 ||
										(1040 <= q && q <= 1103) ||
										q == 1105 ||
										q == 8208 ||
										(8211 <= q && q <= 8214) ||
										(8216 <= q && q <= 8217) ||
										(8220 <= q && q <= 8221) ||
										(8224 <= q && q <= 8226) ||
										(8228 <= q && q <= 8231) ||
										q == 8240 ||
										(8242 <= q && q <= 8243) ||
										q == 8245 ||
										q == 8251 ||
										q == 8254 ||
										q == 8308 ||
										q == 8319 ||
										(8321 <= q && q <= 8324) ||
										q == 8364 ||
										q == 8451 ||
										q == 8453 ||
										q == 8457 ||
										q == 8467 ||
										q == 8470 ||
										(8481 <= q && q <= 8482) ||
										q == 8486 ||
										q == 8491 ||
										(8531 <= q && q <= 8532) ||
										(8539 <= q && q <= 8542) ||
										(8544 <= q && q <= 8555) ||
										(8560 <= q && q <= 8569) ||
										q == 8585 ||
										(8592 <= q && q <= 8601) ||
										(8632 <= q && q <= 8633) ||
										q == 8658 ||
										q == 8660 ||
										q == 8679 ||
										q == 8704 ||
										(8706 <= q && q <= 8707) ||
										(8711 <= q && q <= 8712) ||
										q == 8715 ||
										q == 8719 ||
										q == 8721 ||
										q == 8725 ||
										q == 8730 ||
										(8733 <= q && q <= 8736) ||
										q == 8739 ||
										q == 8741 ||
										(8743 <= q && q <= 8748) ||
										q == 8750 ||
										(8756 <= q && q <= 8759) ||
										(8764 <= q && q <= 8765) ||
										q == 8776 ||
										q == 8780 ||
										q == 8786 ||
										(8800 <= q && q <= 8801) ||
										(8804 <= q && q <= 8807) ||
										(8810 <= q && q <= 8811) ||
										(8814 <= q && q <= 8815) ||
										(8834 <= q && q <= 8835) ||
										(8838 <= q && q <= 8839) ||
										q == 8853 ||
										q == 8857 ||
										q == 8869 ||
										q == 8895 ||
										q == 8978 ||
										(9312 <= q && q <= 9449) ||
										(9451 <= q && q <= 9547) ||
										(9552 <= q && q <= 9587) ||
										(9600 <= q && q <= 9615) ||
										(9618 <= q && q <= 9621) ||
										(9632 <= q && q <= 9633) ||
										(9635 <= q && q <= 9641) ||
										(9650 <= q && q <= 9651) ||
										(9654 <= q && q <= 9655) ||
										(9660 <= q && q <= 9661) ||
										(9664 <= q && q <= 9665) ||
										(9670 <= q && q <= 9672) ||
										q == 9675 ||
										(9678 <= q && q <= 9681) ||
										(9698 <= q && q <= 9701) ||
										q == 9711 ||
										(9733 <= q && q <= 9734) ||
										q == 9737 ||
										(9742 <= q && q <= 9743) ||
										(9748 <= q && q <= 9749) ||
										q == 9756 ||
										q == 9758 ||
										q == 9792 ||
										q == 9794 ||
										(9824 <= q && q <= 9825) ||
										(9827 <= q && q <= 9829) ||
										(9831 <= q && q <= 9834) ||
										(9836 <= q && q <= 9837) ||
										q == 9839 ||
										(9886 <= q && q <= 9887) ||
										(9918 <= q && q <= 9919) ||
										(9924 <= q && q <= 9933) ||
										(9935 <= q && q <= 9953) ||
										q == 9955 ||
										(9960 <= q && q <= 9983) ||
										q == 10045 ||
										q == 10071 ||
										(10102 <= q && q <= 10111) ||
										(11093 <= q && q <= 11097) ||
										(12872 <= q && q <= 12879) ||
										(57344 <= q && q <= 63743) ||
										(65024 <= q && q <= 65039) ||
										q == 65533 ||
										(127232 <= q && q <= 127242) ||
										(127248 <= q && q <= 127277) ||
										(127280 <= q && q <= 127337) ||
										(127344 <= q && q <= 127386) ||
										(917760 <= q && q <= 917999) ||
										(983040 <= q && q <= 1048573) ||
										(1048576 <= q && q <= 1114109)
									? "A"
									: "N"
			);
		}),
		(F.characterLength = function (B) {
			var $ = this.eastAsianWidth(B);
			return $ == "F" || $ == "W" || $ == "A" ? 2 : 1;
		});
	function _(B) {
		return B.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
	}
	(F.length = function (B) {
		for (var $ = _(B), Z = 0, q = 0; q < $.length; q++)
			Z = Z + this.characterLength($[q]);
		return Z;
	}),
		(F.slice = function (B, $, Z) {
			(textLen = F.length(B)),
				($ = $ || 0),
				(Z = Z || 1),
				$ < 0 && ($ = textLen + $),
				Z < 0 && (Z = textLen + Z);
			for (var q = "", X = 0, Q = _(B), J = 0; J < Q.length; J++) {
				var z = Q[J],
					A = F.length(z);
				if (X >= $ - (A == 2 ? 1 : 0))
					if (X + A <= Z) q += z;
					else break;
				X += A;
			}
			return q;
		});
})(gB);
var tK = gB.exports,
	eK = bB(tK),
	DY = function () {
		return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
	},
	FY = bB(DY);
function T1(D, F = {}) {
	if (
		typeof D != "string" ||
		D.length === 0 ||
		((F = { ambiguousIsNarrow: !0, ...F }), (D = xB(D)), D.length === 0)
	)
		return 0;
	D = D.replace(FY(), "  ");
	let _ = F.ambiguousIsNarrow ? 1 : 2,
		B = 0;
	for (let $ of D) {
		let Z = $.codePointAt(0);
		if (Z <= 31 || (Z >= 127 && Z <= 159) || (Z >= 768 && Z <= 879)) continue;
		switch (eK.eastAsianWidth($)) {
			case "F":
			case "W":
				B += 2;
				break;
			case "A":
				B += _;
				break;
			default:
				B += 1;
		}
	}
	return B;
}
var _7 = 10,
	TB =
		(D = 0) =>
		(F) =>
			`\x1B[${F + D}m`,
	OB =
		(D = 0) =>
		(F) =>
			`\x1B[${38 + D};5;${F}m`,
	wB =
		(D = 0) =>
		(F, _, B) =>
			`\x1B[${38 + D};2;${F};${_};${B}m`,
	f = {
		modifier: {
			reset: [0, 0],
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			overline: [53, 55],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29],
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			blackBright: [90, 39],
			gray: [90, 39],
			grey: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39],
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],
			bgBlackBright: [100, 49],
			bgGray: [100, 49],
			bgGrey: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49],
		},
	};
Object.keys(f.modifier);
var _Y = Object.keys(f.color),
	BY = Object.keys(f.bgColor);
[..._Y];
function $Y() {
	let D = new Map();
	for (let [F, _] of Object.entries(f)) {
		for (let [B, $] of Object.entries(_))
			(f[B] = { open: `\x1B[${$[0]}m`, close: `\x1B[${$[1]}m` }),
				(_[B] = f[B]),
				D.set($[0], $[1]);
		Object.defineProperty(f, F, { value: _, enumerable: !1 });
	}
	return (
		Object.defineProperty(f, "codes", { value: D, enumerable: !1 }),
		(f.color.close = "\x1B[39m"),
		(f.bgColor.close = "\x1B[49m"),
		(f.color.ansi = TB()),
		(f.color.ansi256 = OB()),
		(f.color.ansi16m = wB()),
		(f.bgColor.ansi = TB(_7)),
		(f.bgColor.ansi256 = OB(_7)),
		(f.bgColor.ansi16m = wB(_7)),
		Object.defineProperties(f, {
			rgbToAnsi256: {
				value: (F, _, B) =>
					F === _ && _ === B
						? F < 8
							? 16
							: F > 248
								? 231
								: Math.round(((F - 8) / 247) * 24) + 232
						: 16 +
							36 * Math.round((F / 255) * 5) +
							6 * Math.round((_ / 255) * 5) +
							Math.round((B / 255) * 5),
				enumerable: !1,
			},
			hexToRgb: {
				value: (F) => {
					let _ = /[a-f\d]{6}|[a-f\d]{3}/i.exec(F.toString(16));
					if (!_) return [0, 0, 0];
					let [B] = _;
					B.length === 3 && (B = [...B].map((Z) => Z + Z).join(""));
					let $ = Number.parseInt(B, 16);
					return [($ >> 16) & 255, ($ >> 8) & 255, $ & 255];
				},
				enumerable: !1,
			},
			hexToAnsi256: {
				value: (F) => f.rgbToAnsi256(...f.hexToRgb(F)),
				enumerable: !1,
			},
			ansi256ToAnsi: {
				value: (F) => {
					if (F < 8) return 30 + F;
					if (F < 16) return 90 + (F - 8);
					let _, B, $;
					if (F >= 232) (_ = ((F - 232) * 10 + 8) / 255), (B = _), ($ = _);
					else {
						F -= 16;
						let X = F % 36;
						(_ = Math.floor(F / 36) / 5),
							(B = Math.floor(X / 6) / 5),
							($ = (X % 6) / 5);
					}
					let Z = Math.max(_, B, $) * 2;
					if (Z === 0) return 30;
					let q =
						30 + ((Math.round($) << 2) | (Math.round(B) << 1) | Math.round(_));
					return Z === 2 && (q += 60), q;
				},
				enumerable: !1,
			},
			rgbToAnsi: {
				value: (F, _, B) => f.ansi256ToAnsi(f.rgbToAnsi256(F, _, B)),
				enumerable: !1,
			},
			hexToAnsi: {
				value: (F) => f.ansi256ToAnsi(f.hexToAnsi256(F)),
				enumerable: !1,
			},
		}),
		f
	);
}
var qY = $Y(),
	_3 = new Set(["\x1B", "\x9B"]),
	ZY = 39,
	q7 = "\x07",
	vB = "[",
	XY = "]",
	yB = "m",
	Z7 = `${XY}8;;`,
	jB = (D) => `${_3.values().next().value}${vB}${D}${yB}`,
	uB = (D) => `${_3.values().next().value}${Z7}${D}${q7}`,
	QY = (D) => D.split(" ").map((F) => T1(F)),
	B7 = (D, F, _) => {
		let B = [...F],
			$ = !1,
			Z = !1,
			q = T1(xB(D[D.length - 1]));
		for (let [X, Q] of B.entries()) {
			let J = T1(Q);
			if (
				(q + J <= _ ? (D[D.length - 1] += Q) : (D.push(Q), (q = 0)),
				_3.has(Q) &&
					(($ = !0),
					(Z = B.slice(X + 1)
						.join("")
						.startsWith(Z7))),
				$)
			) {
				Z ? Q === q7 && (($ = !1), (Z = !1)) : Q === yB && ($ = !1);
				continue;
			}
			(q += J), q === _ && X < B.length - 1 && (D.push(""), (q = 0));
		}
		!q &&
			D[D.length - 1].length > 0 &&
			D.length > 1 &&
			(D[D.length - 2] += D.pop());
	},
	JY = (D) => {
		let F = D.split(" "),
			_ = F.length;
		for (; _ > 0 && !(T1(F[_ - 1]) > 0); ) _--;
		return _ === F.length ? D : F.slice(0, _).join(" ") + F.slice(_).join("");
	},
	zY = (D, F, _ = {}) => {
		if (_.trim !== !1 && D.trim() === "") return "";
		let B = "",
			$,
			Z,
			q = QY(D),
			X = [""];
		for (let [J, z] of D.split(" ").entries()) {
			_.trim !== !1 && (X[X.length - 1] = X[X.length - 1].trimStart());
			let A = T1(X[X.length - 1]);
			if (
				(J !== 0 &&
					(A >= F &&
						(_.wordWrap === !1 || _.trim === !1) &&
						(X.push(""), (A = 0)),
					(A > 0 || _.trim === !1) && ((X[X.length - 1] += " "), A++)),
				_.hard && q[J] > F)
			) {
				let L = F - A,
					G = 1 + Math.floor((q[J] - L - 1) / F);
				Math.floor((q[J] - 1) / F) < G && X.push(""), B7(X, z, F);
				continue;
			}
			if (A + q[J] > F && A > 0 && q[J] > 0) {
				if (_.wordWrap === !1 && A < F) {
					B7(X, z, F);
					continue;
				}
				X.push("");
			}
			if (A + q[J] > F && _.wordWrap === !1) {
				B7(X, z, F);
				continue;
			}
			X[X.length - 1] += z;
		}
		_.trim !== !1 && (X = X.map((J) => JY(J)));
		let Q = [
			...X.join(`
`),
		];
		for (let [J, z] of Q.entries()) {
			if (((B += z), _3.has(z))) {
				let { groups: L } = new RegExp(
					`(?:\\${vB}(?<code>\\d+)m|\\${Z7}(?<uri>.*)${q7})`,
				).exec(Q.slice(J).join("")) || { groups: {} };
				if (L.code !== void 0) {
					let G = Number.parseFloat(L.code);
					$ = G === ZY ? void 0 : G;
				} else L.uri !== void 0 && (Z = L.uri.length === 0 ? void 0 : L.uri);
			}
			let A = qY.codes.get(Number($));
			Q[J + 1] ===
			`
`
				? (Z && (B += uB("")), $ && A && (B += jB(A)))
				: z ===
						`
` && ($ && A && (B += jB($)), Z && (B += uB(Z)));
		}
		return B;
	};
function NB(D, F, _) {
	return String(D)
		.normalize()
		.replace(
			/\r\n/g,
			`
`,
		)
		.split(`
`)
		.map((B) => zY(B, F, _))
		.join(`
`);
}
var AY = ["up", "down", "left", "right", "space", "enter", "cancel"],
	F3 = {
		actions: new Set(AY),
		aliases: new Map([
			["k", "up"],
			["j", "down"],
			["h", "left"],
			["l", "right"],
			["\x03", "cancel"],
			["escape", "cancel"],
		]),
	};
function kB(D, F) {
	if (typeof D == "string") return F3.aliases.get(D) === F;
	for (let _ of D) if (_ !== void 0 && kB(_, F)) return !0;
	return !1;
}
function LY(D, F) {
	if (D === F) return;
	let _ = D.split(`
`),
		B = F.split(`
`),
		$ = [];
	for (let Z = 0; Z < Math.max(_.length, B.length); Z++)
		_[Z] !== B[Z] && $.push(Z);
	return $;
}
var kO = globalThis.process.platform.startsWith("win"),
	$7 = Symbol("clack:cancel");
function TD(D) {
	return D === $7;
}
function D3(D, F) {
	let _ = D;
	_.isTTY && _.setRawMode(F);
}
var GY = Object.defineProperty,
	VY = (D, F, _) =>
		F in D
			? GY(D, F, { enumerable: !0, configurable: !0, writable: !0, value: _ })
			: (D[F] = _),
	G0 = (D, F, _) => (VY(D, typeof F != "symbol" ? F + "" : F, _), _);
class B3 {
	constructor(D, F = !0) {
		G0(this, "input"),
			G0(this, "output"),
			G0(this, "_abortSignal"),
			G0(this, "rl"),
			G0(this, "opts"),
			G0(this, "_render"),
			G0(this, "_track", !1),
			G0(this, "_prevFrame", ""),
			G0(this, "_subscribers", new Map()),
			G0(this, "_cursor", 0),
			G0(this, "state", "initial"),
			G0(this, "error", ""),
			G0(this, "value");
		let { input: _ = iK, output: B = sK, render: $, signal: Z, ...q } = D;
		(this.opts = q),
			(this.onKeypress = this.onKeypress.bind(this)),
			(this.close = this.close.bind(this)),
			(this.render = this.render.bind(this)),
			(this._render = $.bind(this)),
			(this._track = F),
			(this._abortSignal = Z),
			(this.input = _),
			(this.output = B);
	}
	unsubscribe() {
		this._subscribers.clear();
	}
	setSubscriber(D, F) {
		let _ = this._subscribers.get(D) ?? [];
		_.push(F), this._subscribers.set(D, _);
	}
	on(D, F) {
		this.setSubscriber(D, { cb: F });
	}
	once(D, F) {
		this.setSubscriber(D, { cb: F, once: !0 });
	}
	emit(D, ...F) {
		let _ = this._subscribers.get(D) ?? [],
			B = [];
		for (let $ of _)
			$.cb(...F), $.once && B.push(() => _.splice(_.indexOf($), 1));
		for (let $ of B) $();
	}
	prompt() {
		return new Promise((D, F) => {
			if (this._abortSignal) {
				if (this._abortSignal.aborted)
					return (this.state = "cancel"), this.close(), D($7);
				this._abortSignal.addEventListener(
					"abort",
					() => {
						(this.state = "cancel"), this.close();
					},
					{ once: !0 },
				);
			}
			let _ = new rK(0);
			(_._write = (B, $, Z) => {
				this._track &&
					((this.value = this.rl?.line.replace(/\t/g, "")),
					(this._cursor = this.rl?.cursor ?? 0),
					this.emit("value", this.value)),
					Z();
			}),
				this.input.pipe(_),
				(this.rl = PB.createInterface({
					input: this.input,
					output: _,
					tabSize: 2,
					prompt: "",
					escapeCodeTimeout: 50,
				})),
				PB.emitKeypressEvents(this.input, this.rl),
				this.rl.prompt(),
				this.opts.initialValue !== void 0 &&
					this._track &&
					this.rl.write(this.opts.initialValue),
				this.input.on("keypress", this.onKeypress),
				D3(this.input, !0),
				this.output.on("resize", this.render),
				this.render(),
				this.once("submit", () => {
					this.output.write(V0.cursor.show),
						this.output.off("resize", this.render),
						D3(this.input, !1),
						D(this.value);
				}),
				this.once("cancel", () => {
					this.output.write(V0.cursor.show),
						this.output.off("resize", this.render),
						D3(this.input, !1),
						D($7);
				});
		});
	}
	onKeypress(D, F) {
		if (
			(this.state === "error" && (this.state = "active"),
			F?.name &&
				(!this._track &&
					F3.aliases.has(F.name) &&
					this.emit("cursor", F3.aliases.get(F.name)),
				F3.actions.has(F.name) && this.emit("cursor", F.name)),
			D &&
				(D.toLowerCase() === "y" || D.toLowerCase() === "n") &&
				this.emit("confirm", D.toLowerCase() === "y"),
			D === "\t" &&
				this.opts.placeholder &&
				(this.value ||
					(this.rl?.write(this.opts.placeholder),
					this.emit("value", this.opts.placeholder))),
			D && this.emit("key", D.toLowerCase()),
			F?.name === "return")
		) {
			if (this.opts.validate) {
				let _ = this.opts.validate(this.value);
				_ &&
					((this.error = _ instanceof Error ? _.message : _),
					(this.state = "error"),
					this.rl?.write(this.value));
			}
			this.state !== "error" && (this.state = "submit");
		}
		kB([D, F?.name, F?.sequence], "cancel") && (this.state = "cancel"),
			(this.state === "submit" || this.state === "cancel") &&
				this.emit("finalize"),
			this.render(),
			(this.state === "submit" || this.state === "cancel") && this.close();
	}
	close() {
		this.input.unpipe(),
			this.input.removeListener("keypress", this.onKeypress),
			this.output.write(`
`),
			D3(this.input, !1),
			this.rl?.close(),
			(this.rl = void 0),
			this.emit(`${this.state}`, this.value),
			this.unsubscribe();
	}
	restoreCursor() {
		let D =
			NB(this._prevFrame, process.stdout.columns, { hard: !0 }).split(`
`).length - 1;
		this.output.write(V0.cursor.move(-999, D * -1));
	}
	render() {
		let D = NB(this._render(this) ?? "", process.stdout.columns, { hard: !0 });
		if (D !== this._prevFrame) {
			if (this.state === "initial") this.output.write(V0.cursor.hide);
			else {
				let F = LY(this._prevFrame, D);
				if ((this.restoreCursor(), F && F?.length === 1)) {
					let _ = F[0];
					this.output.write(V0.cursor.move(0, _)),
						this.output.write(V0.erase.lines(1));
					let B = D.split(`
`);
					this.output.write(B[_]),
						(this._prevFrame = D),
						this.output.write(V0.cursor.move(0, B.length - _ - 1));
					return;
				}
				if (F && F?.length > 1) {
					let _ = F[0];
					this.output.write(V0.cursor.move(0, _)),
						this.output.write(V0.erase.down());
					let B = D.split(`
`).slice(_);
					this.output.write(
						B.join(`
`),
					),
						(this._prevFrame = D);
					return;
				}
				this.output.write(V0.erase.down());
			}
			this.output.write(D),
				this.state === "initial" && (this.state = "active"),
				(this._prevFrame = D);
		}
	}
}
class X7 extends B3 {
	get cursor() {
		return this.value ? 0 : 1;
	}
	get _value() {
		return this.cursor === 0;
	}
	constructor(D) {
		super(D, !1),
			(this.value = !!D.initialValue),
			this.on("value", () => {
				this.value = this._value;
			}),
			this.on("confirm", (F) => {
				this.output.write(V0.cursor.move(0, -1)),
					(this.value = F),
					(this.state = "submit"),
					this.close();
			}),
			this.on("cursor", () => {
				this.value = !this.value;
			});
	}
}
var CY = Object.defineProperty,
	WY = (D, F, _) =>
		F in D
			? CY(D, F, { enumerable: !0, configurable: !0, writable: !0, value: _ })
			: (D[F] = _),
	SB = (D, F, _) => (WY(D, typeof F != "symbol" ? F + "" : F, _), _);
class Q7 extends B3 {
	constructor(D) {
		super(D, !1),
			SB(this, "options"),
			SB(this, "cursor", 0),
			(this.options = D.options),
			(this.cursor = this.options.findIndex(
				({ value: F }) => F === D.initialValue,
			)),
			this.cursor === -1 && (this.cursor = 0),
			this.changeValue(),
			this.on("cursor", (F) => {
				switch (F) {
					case "left":
					case "up":
						this.cursor =
							this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
						break;
					case "down":
					case "right":
						this.cursor =
							this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
						break;
				}
				this.changeValue();
			});
	}
	get _value() {
		return this.options[this.cursor];
	}
	changeValue() {
		this.value = this._value.value;
	}
}
class J7 extends B3 {
	get valueWithCursor() {
		if (this.state === "submit") return this.value;
		if (this.cursor >= this.value.length) return `${this.value}\u2588`;
		let D = this.value.slice(0, this.cursor),
			[F, ..._] = this.value.slice(this.cursor);
		return `${D}${EB.default.inverse(F)}${_.join("")}`;
	}
	get cursor() {
		return this._cursor;
	}
	constructor(D) {
		super(D),
			this.on("finalize", () => {
				this.value || (this.value = D.defaultValue);
			});
	}
}
var T = s0(F7(), 1),
	fB = s0(e6(), 1);
import u0 from "process";
function HY() {
	return u0.platform !== "win32"
		? u0.env.TERM !== "linux"
		: !!u0.env.CI ||
				!!u0.env.WT_SESSION ||
				!!u0.env.TERMINUS_SUBLIME ||
				u0.env.ConEmuTask === "{cmd::Cmder}" ||
				u0.env.TERM_PROGRAM === "Terminus-Sublime" ||
				u0.env.TERM_PROGRAM === "vscode" ||
				u0.env.TERM === "xterm-256color" ||
				u0.env.TERM === "alacritty" ||
				u0.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var KY = HY(),
	l = (D, F) => (KY ? D : F),
	YY = l("\u25C6", "*"),
	IY = l("\u25A0", "x"),
	UY = l("\u25B2", "x"),
	MY = l("\u25C7", "o"),
	sO = l("\u250C", "T"),
	t = l("\u2502", "|"),
	O1 = l("\u2514", "\u2014"),
	z7 = l("\u25CF", ">"),
	A7 = l("\u25CB", " "),
	rO = l("\u25FB", "[\u2022]"),
	nO = l("\u25FC", "[+]"),
	oO = l("\u25FB", "[ ]"),
	tO = l("\u25AA", "\u2022"),
	eO = l("\u2500", "-"),
	Dw = l("\u256E", "+"),
	Fw = l("\u251C", "+"),
	_w = l("\u256F", "+"),
	Bw = l("\u25CF", "\u2022"),
	$w = l("\u25C6", "*"),
	qw = l("\u25B2", "!"),
	Zw = l("\u25A0", "x"),
	L7 = (D) => {
		switch (D) {
			case "initial":
			case "active":
				return T.default.cyan(YY);
			case "cancel":
				return T.default.red(IY);
			case "error":
				return T.default.yellow(UY);
			case "submit":
				return T.default.green(MY);
		}
	},
	RY = (D) => {
		let { cursor: F, options: _, style: B } = D,
			$ = D.maxItems ?? Number.POSITIVE_INFINITY,
			Z = Math.max(process.stdout.rows - 4, 0),
			q = Math.min(Z, Math.max($, 5)),
			X = 0;
		F >= X + q - 3
			? (X = Math.max(Math.min(F - q + 3, _.length - q), 0))
			: F < X + 2 && (X = Math.max(F - 2, 0));
		let Q = q < _.length && X > 0,
			J = q < _.length && X + q < _.length;
		return _.slice(X, X + q).map((z, A, L) => {
			let G = A === 0 && Q,
				H = A === L.length - 1 && J;
			return G || H ? T.default.dim("...") : B(z, A + X === F);
		});
	},
	mB = (D) =>
		new J7({
			validate: D.validate,
			placeholder: D.placeholder,
			defaultValue: D.defaultValue,
			initialValue: D.initialValue,
			render() {
				let F = `${T.default.gray(t)}
${L7(this.state)}  ${D.message}
`,
					_ = D.placeholder
						? T.default.inverse(D.placeholder[0]) +
							T.default.dim(D.placeholder.slice(1))
						: T.default.inverse(T.default.hidden("_")),
					B = this.value ? this.valueWithCursor : _;
				switch (this.state) {
					case "error":
						return `${F.trim()}
${T.default.yellow(t)}  ${B}
${T.default.yellow(O1)}  ${T.default.yellow(this.error)}
`;
					case "submit":
						return `${F}${T.default.gray(t)}  ${T.default.dim(this.value || D.placeholder)}`;
					case "cancel":
						return `${F}${T.default.gray(t)}  ${T.default.strikethrough(T.default.dim(this.value ?? ""))}${
							this.value?.trim()
								? `
${T.default.gray(t)}`
								: ""
						}`;
					default:
						return `${F}${T.default.cyan(t)}  ${B}
${T.default.cyan(O1)}
`;
				}
			},
		}).prompt();
var hB = (D) => {
		let F = D.active ?? "Yes",
			_ = D.inactive ?? "No";
		return new X7({
			active: F,
			inactive: _,
			initialValue: D.initialValue ?? !0,
			render() {
				let B = `${T.default.gray(t)}
${L7(this.state)}  ${D.message}
`,
					$ = this.value ? F : _;
				switch (this.state) {
					case "submit":
						return `${B}${T.default.gray(t)}  ${T.default.dim($)}`;
					case "cancel":
						return `${B}${T.default.gray(t)}  ${T.default.strikethrough(T.default.dim($))}
${T.default.gray(t)}`;
					default:
						return `${B}${T.default.cyan(t)}  ${this.value ? `${T.default.green(z7)} ${F}` : `${T.default.dim(A7)} ${T.default.dim(F)}`} ${T.default.dim("/")} ${this.value ? `${T.default.dim(A7)} ${T.default.dim(_)}` : `${T.default.green(z7)} ${_}`}
${T.default.cyan(O1)}
`;
				}
			},
		}).prompt();
	},
	lB = (D) => {
		let F = (_, B) => {
			let $ = _.label ?? String(_.value);
			switch (B) {
				case "selected":
					return `${T.default.dim($)}`;
				case "active":
					return `${T.default.green(z7)} ${$} ${_.hint ? T.default.dim(`(${_.hint})`) : ""}`;
				case "cancelled":
					return `${T.default.strikethrough(T.default.dim($))}`;
				default:
					return `${T.default.dim(A7)} ${T.default.dim($)}`;
			}
		};
		return new Q7({
			options: D.options,
			initialValue: D.initialValue,
			render() {
				let _ = `${T.default.gray(t)}
${L7(this.state)}  ${D.message}
`;
				switch (this.state) {
					case "submit":
						return `${_}${T.default.gray(t)}  ${F(this.options[this.cursor], "selected")}`;
					case "cancel":
						return `${_}${T.default.gray(t)}  ${F(this.options[this.cursor], "cancelled")}
${T.default.gray(t)}`;
					default:
						return `${_}${T.default.cyan(t)}  ${RY({
							cursor: this.cursor,
							options: this.options,
							maxItems: D.maxItems,
							style: (B, $) => F(B, $ ? "active" : "inactive"),
						}).join(`
${T.default.cyan(t)}  `)}
${T.default.cyan(O1)}
`;
				}
			},
		}).prompt();
	};
var M2 = (D = "") => {
	process.stdout.write(`${T.default.gray(O1)}  ${T.default.red(D)}

`);
};
var dB = async () => {
		let D = await cB(QB);
		if (!D) M2(Z0.PROGRAM.CANCELED), process.exit(0);
		if (!D.status)
			await IB("Sorry!", "Template is not ready yet. Please try again later."),
				q0(`
`),
				process.exit(0);
		return (
			await f0(
				"Yey!",
				`You selected ${U.green(D.label)} for your new project.`,
			),
			v0(g0.COMMAND.BOILERPLATE, D),
			D
		);
	},
	cB = async (D, F = "Pick your tech!") => {
		let _ = await lB({
			message: `${oF("type")} ${F}`,
			options: D,
			maxItems: 2,
		});
		if (TD(_)) return;
		let B = D.find(($) => $.value === _);
		if (B?.children)
			return await cB(B.children, `What specific type of ${B.label}?`);
		return B;
	};
var pB = async () => {
	let D = await hB({
		message: "Install dependencies?",
		active: "yes",
		inactive: "no",
		initialValue: !0,
	});
	if (TD(D)) M2(Z0.PROGRAM.CANCELED), process.exit(0);
	if (!D)
		await f0("No problem!", "Remember to install dependencies after setup.");
	return v0(g0.COMMAND.INSTALL_DEPENDENCY, D), D;
};
var aB = async () => {
	let D = await mB({
		placeholder:
			"e.g., myproject (lowercase letters, no spaces, max 30 chars, no numbers at the start)",
		message: `${oF("dir")} Where should we create your new project?`,
		validate(F) {
			if (/\s/.test(F)) return "Project name cannot contain spaces";
			if (!F) return "Project name is required";
			if (!/^[a-z][a-z0-9]*$/.test(F))
				return "Project name must start with a lowercase letter and can only contain lowercase letters and numbers (no numbers at the start)";
			if (F.length > 30) return "Project name cannot exceed 30 characters";
			return;
		},
	});
	if (TD(D)) M2(Z0.PROGRAM.CANCELED), process.exit(0);
	return (
		await f0("Thanks!", `The project will be created in ${U.green(D)}`),
		v0(g0.COMMAND.PACKAGE_NAME, D),
		D
	);
};
import K8 from "fs/promises";
import Y8 from "path";
import iM from "fs/promises";
import aM from "fs/promises";
import o1 from "fs";
import X8 from "path";
var TX = s0(IX(), 1);
import n1 from "fs/promises";
import PX from "fs";
import hM from "os";
import F4 from "path";
import { pipeline as lM } from "stream";
import { promisify as dM } from "util";
class o9 extends Error {}
class Z8 extends Error {}
class t9 extends Error {}
class e9 extends Error {}
import yM from "path";
var UX = async (D, F) => {
		let _ = new URL(D),
			B = yM.basename(_.pathname);
		return {
			name: B,
			version: void 0,
			subdir: void 0,
			url: _.href,
			tar: _.href,
			defaultDir: B,
			headers: F.auth ? { Authorization: `Bearer ${F.auth}` } : void 0,
		};
	},
	MX = async (D, F) => {
		let _ = s1(D),
			B = await D4(_, F, async () => {
				return (
					await (await a2(`https://api.github.com/repos/${_.repo}`)).json()
				)?.default_branch;
			});
		return {
			name: _.repo.replace("/", "-"),
			version: B,
			subdir: _.subdir,
			headers: {
				...(F.auth ? { Authorization: `Bearer ${F.auth}` } : {}),
				Accept: "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
			},
			url: `https://github.com/${_.repo}/tree/${B}${_.subdir}`,
			tar: `https://api.github.com/repos/${_.repo}/tarball/${B}`,
		};
	},
	kM = async (D, F) => {
		let _ = s1(D),
			B = await D4(_, F, async () => {
				return (
					await (
						await a2(
							`https://gitlab.com/api/v4/projects/${encodeURIComponent(_.repo)}`,
						)
					).json()
				)?.default_branch;
			});
		return {
			name: _.repo.replace("/", "-"),
			version: B,
			subdir: _.subdir,
			headers: {
				...(F.auth ? { Authorization: `Bearer ${F.auth}` } : {}),
				"sec-fetch-mode": "same-origin",
			},
			url: `https://gitlab.com/${_.repo}/tree/${B}${_.subdir}`,
			tar: `https://gitlab.com/${_.repo}/-/archive/${B}.tar.gz`,
		};
	},
	fM = async (D, F) => {
		let _ = s1(D),
			B = await D4(_, F, async () => {
				return (
					await (
						await a2(`https://api.bitbucket.org/2.0/repositories/${_.repo}`)
					).json()
				)?.mainbranch?.name;
			});
		return {
			name: _.repo.replace("/", "-"),
			version: B,
			subdir: _.subdir,
			headers: F.auth ? { Authorization: `Bearer ${F.auth}` } : {},
			url: `https://bitbucket.com/${_.repo}/src/${B}${_.subdir}`,
			tar: `https://bitbucket.org/${_.repo}/get/${B}.tar.gz`,
		};
	},
	mM = (D, F) => {
		let _ = s1(D),
			B = _.ref || "main";
		return {
			name: _.repo.replace("/", "-"),
			version: B,
			subdir: _.subdir,
			headers: F.auth ? { Authorization: `Bearer ${F.auth}` } : {},
			url: `https://git.sr.ht/~${_.repo}/tree/${B}/item${_.subdir}`,
			tar: `https://git.sr.ht/~${_.repo}/archive/${B}.tar.gz`,
		};
	},
	RX = {
		http: UX,
		https: UX,
		github: MX,
		gh: MX,
		gitlab: kM,
		bitbucket: fM,
		sourcehut: mM,
	};
async function D4(D, F, _) {
	if (D.ref) return D.ref;
	if (F.offline !== !0)
		try {
			let B = await _();
			if (B) return B;
		} catch (B) {
			r1(`Failed to fetch ref for ${D.repo}`, B);
		}
	return "main";
}
var cM = /^([\w-.]+):/;
function OX(D, F, _) {
	F ||= "github";
	let B = D,
		$ = D.match(cM);
	if ($) {
		if (((F = $[1]), F !== "http" && F !== "https")) B = D.slice($[0].length);
	}
	let Z = _?.[F] || RX[F];
	return { source: B, providerName: F, provider: Z };
}
async function wX(D, F, _ = {}) {
	let B = F + ".json",
		$ = JSON.parse(await n1.readFile(B, "utf8").catch(() => "{}")),
		q = (
			await a2(D, { ..._, method: "HEAD" }).catch(() => {
				return;
			})
		)?.headers.get("etag");
	if ($.etag === q && PX.existsSync(F)) return;
	if (typeof q === "string") $.etag = q;
	let X = await a2(D, { headers: _.headers });
	if (X.status >= 400)
		throw new Z8(`Failed to download ${D}: ${X.status} ${X.statusText}`);
	if (X.body == null)
		throw new Z8(`Failed to download ${D}: empty response body`);
	await n1.mkdir(F4.dirname(F), { recursive: !0 });
	let Q = PX.createWriteStream(F);
	await dM(lM)(X.body, Q), await n1.writeFile(B, JSON.stringify($), "utf8");
}
var pM = /^(?<repo>[\w\-.]+\/[\w\-.]+)(?<subdir>[^#]+)?(?<ref>#[\w\-./@]+)?/;
function s1(D) {
	let F = D.match(pM)?.groups || {};
	return { repo: F.repo, subdir: F.subdir || "/", ref: F.ref?.slice(1) };
}
function r1(...D) {
	if (process.env.DEBUG) console.debug("[giget]", ...D);
}
async function a2(D, F = {}) {
	if (F.headers?.["sec-fetch-mode"]) F.mode = F.headers["sec-fetch-mode"];
	let _ = await fetch(D, F).catch((B) => {
		throw new Error(`Failed to fetch ${D}`, { cause: B });
	});
	if (F.validateStatus && _.status >= 400)
		throw new Error(`Failed to fetch ${D}: ${_.status} ${_.statusText}`);
	return _;
}
function jX() {
	return process.env.XDG_CACHE_HOME
		? F4.resolve(process.env.XDG_CACHE_HOME, "bluwy-giget")
		: F4.resolve(hM.homedir(), ".cache/bluwy-giget");
}
async function uX(D, F, _) {
	if (_ === "/") _ = void 0;
	if (_) {
		if (_.startsWith("/")) _ = _.slice(1);
		if (!_.endsWith("/")) _ += "/";
	}
	let B = !1;
	if (
		(await n1.mkdir(F, { recursive: !0 }),
		await TX.extract({
			file: D,
			cwd: F,
			onentry($) {
				if ((($.path = $.path.split("/").splice(1).join("/")), _))
					if ($.path.startsWith(_))
						($.path = $.path.slice(_.length - 1)), (B = !0);
					else $.path = "";
			},
		}),
		_ && !B)
	)
		throw (
			(await n1.rm(F, { recursive: !0, force: !0 }),
			new t9(`Subdirectory not found in tar: ${_}`))
		);
}
async function _4(D, F = {}) {
	let {
		source: _,
		providerName: B,
		provider: $,
	} = OX(D, F.provider, F.providers);
	if (!$) throw new o9(`Unsupported provider: ${B}`);
	let Z = { ...F.providerOptions, offline: F.offline },
		q = await Promise.resolve()
			.then(() => $(_, Z))
			.catch((A) => {
				throw new Error(`The ${B} provider failed with errors`, { cause: A });
			});
	(q.name = (q.name || "template").replace(/[^\da-z-]/gi, "-")),
		(q.defaultDir = (q.defaultDir || q.name).replace(/[^\da-z-]/gi, "-"));
	let X = X8.resolve(jX(), B, q.name),
		Q = X8.resolve(X, (q.version || q.name) + ".tar.gz");
	if (F.offline === "prefer" ? !o1.existsSync(Q) : !F.offline)
		await wX(q.tar, Q, { headers: q.headers }).catch((A) => {
			if (!o1.existsSync(Q)) throw A;
			r1("Download error. Using cached version:", A);
		}),
			r1(`Downloaded ${q.tar} to ${Q}`);
	if (!o1.existsSync(Q))
		throw new Error(`Tarball not found: ${Q} (offline: ${F.offline})`);
	let J = X8.resolve(F.cwd || "."),
		z = X8.resolve(J, F.dir || q.defaultDir);
	if (F.force === "clean") await aM.rm(z, { recursive: !0, force: !0 });
	else if (!F.force && o1.existsSync(z) && o1.readdirSync(z).length > 0)
		throw new e9(`Destination ${z} already exists.`);
	return await uX(Q, z, q.subdir), { info: q, source: _, dir: z };
}
async function NX(D, F) {
	try {
		await iM.mkdir(F, { recursive: !0 }), await _4(D, { dir: F, force: !0 });
	} catch (_) {
		throw (
			(console.error(
				U.red(`\u274C Failed to download directory from ${D}: ${_.message}`),
			),
			_)
		);
	}
}
async function B4(D) {
	try {
		let F = sM(D),
			_ = await fetch(F);
		if (!_.ok) throw new Error(`HTTP error! status: ${_.status}`);
		return await _.text();
	} catch (F) {
		throw (
			(console.error(U.red(`\u274C Failed to read file ${D} ${F.message}`)), F)
		);
	}
}
function sM(D) {
	return `${X0.GUTHUB.LOKIO_GITHUB_URL}/${D}`;
}
var Q8 = async () => {
	try {
		return {
			GITHUB_MARKDOWN_INFO: await B4("markdown/info.md"),
			CONFIG_YAML: async (_) => await B4(`configs/${_}.yaml`),
		};
	} catch (D) {
		return (
			console.log(D), { GITHUB_MARKDOWN_INFO: "", CONFIG_YAML: async () => "" }
		);
	}
};
import { exec as WR } from "child_process";
import W8 from "fs/promises";
import nX from "path";
import C8 from "process";
import fX from "process";
import A8 from "process";
var rM = (D, F, _, B) => {
		if (_ === "length" || _ === "prototype") return;
		if (_ === "arguments" || _ === "caller") return;
		let $ = Object.getOwnPropertyDescriptor(D, _),
			Z = Object.getOwnPropertyDescriptor(F, _);
		if (!nM($, Z) && B) return;
		Object.defineProperty(D, _, Z);
	},
	nM = function (D, F) {
		return (
			D === void 0 ||
			D.configurable ||
			(D.writable === F.writable &&
				D.enumerable === F.enumerable &&
				D.configurable === F.configurable &&
				(D.writable || D.value === F.value))
		);
	},
	oM = (D, F) => {
		let _ = Object.getPrototypeOf(F);
		if (_ === Object.getPrototypeOf(D)) return;
		Object.setPrototypeOf(D, _);
	},
	tM = (D, F) => `/* Wrapped ${D}*/
${F}`,
	eM = Object.getOwnPropertyDescriptor(Function.prototype, "toString"),
	DR = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"),
	FR = (D, F, _) => {
		let B = _ === "" ? "" : `with ${_.trim()}() `,
			$ = tM.bind(null, B, F.toString());
		Object.defineProperty($, "name", DR);
		let { writable: Z, enumerable: q, configurable: X } = eM;
		Object.defineProperty(D, "toString", {
			value: $,
			writable: Z,
			enumerable: q,
			configurable: X,
		});
	};
function $4(D, F, { ignoreNonConfigurable: _ = !1 } = {}) {
	let { name: B } = D;
	for (let $ of Reflect.ownKeys(F)) rM(D, F, $, _);
	return oM(D, F), FR(D, F, B), D;
}
var J8 = new WeakMap(),
	SX = (D, F = {}) => {
		if (typeof D !== "function") throw new TypeError("Expected a function");
		let _,
			B = 0,
			$ = D.displayName || D.name || "<anonymous>",
			Z = function (...q) {
				if ((J8.set(Z, ++B), B === 1)) (_ = D.apply(this, q)), (D = void 0);
				else if (F.throw === !0)
					throw new Error(`Function \`${$}\` can only be called once`);
				return _;
			};
		return $4(Z, D), J8.set(Z, B), Z;
	};
SX.callCount = (D) => {
	if (!J8.has(D))
		throw new Error(
			`The given function \`${D.name}\` is not wrapped by the \`onetime\` package`,
		);
	return J8.get(D);
};
var EX = SX;
var J2 = [];
J2.push("SIGHUP", "SIGINT", "SIGTERM");
if (process.platform !== "win32")
	J2.push(
		"SIGALRM",
		"SIGABRT",
		"SIGVTALRM",
		"SIGXCPU",
		"SIGXFSZ",
		"SIGUSR2",
		"SIGTRAP",
		"SIGSYS",
		"SIGQUIT",
		"SIGIOT",
	);
if (process.platform === "linux")
	J2.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
var z8 = (D) =>
		!!D &&
		typeof D === "object" &&
		typeof D.removeListener === "function" &&
		typeof D.emit === "function" &&
		typeof D.reallyExit === "function" &&
		typeof D.listeners === "function" &&
		typeof D.kill === "function" &&
		typeof D.pid === "number" &&
		typeof D.on === "function",
	q4 = Symbol.for("signal-exit emitter"),
	Z4 = globalThis,
	_R = Object.defineProperty.bind(Object);
class xX {
	emitted = { afterExit: !1, exit: !1 };
	listeners = { afterExit: [], exit: [] };
	count = 0;
	id = Math.random();
	constructor() {
		if (Z4[q4]) return Z4[q4];
		_R(Z4, q4, { value: this, writable: !1, enumerable: !1, configurable: !1 });
	}
	on(D, F) {
		this.listeners[D].push(F);
	}
	removeListener(D, F) {
		let _ = this.listeners[D],
			B = _.indexOf(F);
		if (B === -1) return;
		if (B === 0 && _.length === 1) _.length = 0;
		else _.splice(B, 1);
	}
	emit(D, F, _) {
		if (this.emitted[D]) return !1;
		this.emitted[D] = !0;
		let B = !1;
		for (let $ of this.listeners[D]) B = $(F, _) === !0 || B;
		if (D === "exit") B = this.emit("afterExit", F, _) || B;
		return B;
	}
}
class Q4 {}
var BR = (D) => {
	return {
		onExit(F, _) {
			return D.onExit(F, _);
		},
		load() {
			return D.load();
		},
		unload() {
			return D.unload();
		},
	};
};
class bX extends Q4 {
	onExit() {
		return () => {};
	}
	load() {}
	unload() {}
}
class gX extends Q4 {
	#Z = X4.platform === "win32" ? "SIGINT" : "SIGHUP";
	#_ = new xX();
	#D;
	#$;
	#L;
	#F = {};
	#q = !1;
	constructor(D) {
		super();
		(this.#D = D), (this.#F = {});
		for (let F of J2)
			this.#F[F] = () => {
				let _ = this.#D.listeners(F),
					{ count: B } = this.#_,
					$ = D;
				if (
					typeof $.__signal_exit_emitter__ === "object" &&
					typeof $.__signal_exit_emitter__.count === "number"
				)
					B += $.__signal_exit_emitter__.count;
				if (_.length === B) {
					this.unload();
					let Z = this.#_.emit("exit", null, F),
						q = F === "SIGHUP" ? this.#Z : F;
					if (!Z) D.kill(D.pid, q);
				}
			};
		(this.#L = D.reallyExit), (this.#$ = D.emit);
	}
	onExit(D, F) {
		if (!z8(this.#D)) return () => {};
		if (this.#q === !1) this.load();
		let _ = F?.alwaysLast ? "afterExit" : "exit";
		return (
			this.#_.on(_, D),
			() => {
				if (
					(this.#_.removeListener(_, D),
					this.#_.listeners.exit.length === 0 &&
						this.#_.listeners.afterExit.length === 0)
				)
					this.unload();
			}
		);
	}
	load() {
		if (this.#q) return;
		(this.#q = !0), (this.#_.count += 1);
		for (let D of J2)
			try {
				let F = this.#F[D];
				if (F) this.#D.on(D, F);
			} catch (F) {}
		(this.#D.emit = (D, ...F) => {
			return this.#G(D, ...F);
		}),
			(this.#D.reallyExit = (D) => {
				return this.#B(D);
			});
	}
	unload() {
		if (!this.#q) return;
		(this.#q = !1),
			J2.forEach((D) => {
				let F = this.#F[D];
				if (!F) throw new Error("Listener not defined for signal: " + D);
				try {
					this.#D.removeListener(D, F);
				} catch (_) {}
			}),
			(this.#D.emit = this.#$),
			(this.#D.reallyExit = this.#L),
			(this.#_.count -= 1);
	}
	#B(D) {
		if (!z8(this.#D)) return 0;
		return (
			(this.#D.exitCode = D || 0),
			this.#_.emit("exit", this.#D.exitCode, null),
			this.#L.call(this.#D, this.#D.exitCode)
		);
	}
	#G(D, ...F) {
		let _ = this.#$;
		if (D === "exit" && z8(this.#D)) {
			if (typeof F[0] === "number") this.#D.exitCode = F[0];
			let B = _.call(this.#D, D, ...F);
			return this.#_.emit("exit", this.#D.exitCode, null), B;
		} else return _.call(this.#D, D, ...F);
	}
}
var X4 = globalThis.process,
	{ onExit: vX, load: zu, unload: Au } = BR(z8(X4) ? new gX(X4) : new bX());
var yX = A8.stderr.isTTY ? A8.stderr : A8.stdout.isTTY ? A8.stdout : void 0,
	$R = yX
		? EX(() => {
				vX(
					() => {
						yX.write("\x1B[?25h");
					},
					{ alwaysLast: !0 },
				);
			})
		: () => {},
	kX = $R;
var L8 = !1,
	i2 = {};
i2.show = (D = fX.stderr) => {
	if (!D.isTTY) return;
	(L8 = !1), D.write("\x1B[?25h");
};
i2.hide = (D = fX.stderr) => {
	if (!D.isTTY) return;
	kX(), (L8 = !0), D.write("\x1B[?25l");
};
i2.toggle = (D, F) => {
	if (D !== void 0) L8 = D;
	if (L8) i2.show(F);
	else i2.hide(F);
};
var s2 = i2;
var e1 = s0(J4(), 1);
import E0 from "process";
function z4() {
	if (E0.platform !== "win32") return E0.env.TERM !== "linux";
	return (
		Boolean(E0.env.CI) ||
		Boolean(E0.env.WT_SESSION) ||
		Boolean(E0.env.TERMINUS_SUBLIME) ||
		E0.env.ConEmuTask === "{cmd::Cmder}" ||
		E0.env.TERM_PROGRAM === "Terminus-Sublime" ||
		E0.env.TERM_PROGRAM === "vscode" ||
		E0.env.TERM === "xterm-256color" ||
		E0.env.TERM === "alacritty" ||
		E0.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
	);
}
var ZR = {
		info: U.blue("\u2139"),
		success: U.green("\u2714"),
		warning: U.yellow("\u26A0"),
		error: U.red("\u2716"),
	},
	XR = {
		info: U.blue("i"),
		success: U.green("\u221A"),
		warning: U.yellow("\u203C"),
		error: U.red("\xD7"),
	},
	QR = z4() ? ZR : XR,
	t1 = QR;
function A4({ onlyFirst: D = !1 } = {}) {
	let _ = [
		"[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))",
		"(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
	].join("|");
	return new RegExp(_, D ? void 0 : "g");
}
var JR = A4();
function VD(D) {
	if (typeof D !== "string")
		throw new TypeError(`Expected a \`string\`, got \`${typeof D}\``);
	return D.replace(JR, "");
}
function dX(D) {
	return (
		D === 161 ||
		D === 164 ||
		D === 167 ||
		D === 168 ||
		D === 170 ||
		D === 173 ||
		D === 174 ||
		(D >= 176 && D <= 180) ||
		(D >= 182 && D <= 186) ||
		(D >= 188 && D <= 191) ||
		D === 198 ||
		D === 208 ||
		D === 215 ||
		D === 216 ||
		(D >= 222 && D <= 225) ||
		D === 230 ||
		(D >= 232 && D <= 234) ||
		D === 236 ||
		D === 237 ||
		D === 240 ||
		D === 242 ||
		D === 243 ||
		(D >= 247 && D <= 250) ||
		D === 252 ||
		D === 254 ||
		D === 257 ||
		D === 273 ||
		D === 275 ||
		D === 283 ||
		D === 294 ||
		D === 295 ||
		D === 299 ||
		(D >= 305 && D <= 307) ||
		D === 312 ||
		(D >= 319 && D <= 322) ||
		D === 324 ||
		(D >= 328 && D <= 331) ||
		D === 333 ||
		D === 338 ||
		D === 339 ||
		D === 358 ||
		D === 359 ||
		D === 363 ||
		D === 462 ||
		D === 464 ||
		D === 466 ||
		D === 468 ||
		D === 470 ||
		D === 472 ||
		D === 474 ||
		D === 476 ||
		D === 593 ||
		D === 609 ||
		D === 708 ||
		D === 711 ||
		(D >= 713 && D <= 715) ||
		D === 717 ||
		D === 720 ||
		(D >= 728 && D <= 731) ||
		D === 733 ||
		D === 735 ||
		(D >= 768 && D <= 879) ||
		(D >= 913 && D <= 929) ||
		(D >= 931 && D <= 937) ||
		(D >= 945 && D <= 961) ||
		(D >= 963 && D <= 969) ||
		D === 1025 ||
		(D >= 1040 && D <= 1103) ||
		D === 1105 ||
		D === 8208 ||
		(D >= 8211 && D <= 8214) ||
		D === 8216 ||
		D === 8217 ||
		D === 8220 ||
		D === 8221 ||
		(D >= 8224 && D <= 8226) ||
		(D >= 8228 && D <= 8231) ||
		D === 8240 ||
		D === 8242 ||
		D === 8243 ||
		D === 8245 ||
		D === 8251 ||
		D === 8254 ||
		D === 8308 ||
		D === 8319 ||
		(D >= 8321 && D <= 8324) ||
		D === 8364 ||
		D === 8451 ||
		D === 8453 ||
		D === 8457 ||
		D === 8467 ||
		D === 8470 ||
		D === 8481 ||
		D === 8482 ||
		D === 8486 ||
		D === 8491 ||
		D === 8531 ||
		D === 8532 ||
		(D >= 8539 && D <= 8542) ||
		(D >= 8544 && D <= 8555) ||
		(D >= 8560 && D <= 8569) ||
		D === 8585 ||
		(D >= 8592 && D <= 8601) ||
		D === 8632 ||
		D === 8633 ||
		D === 8658 ||
		D === 8660 ||
		D === 8679 ||
		D === 8704 ||
		D === 8706 ||
		D === 8707 ||
		D === 8711 ||
		D === 8712 ||
		D === 8715 ||
		D === 8719 ||
		D === 8721 ||
		D === 8725 ||
		D === 8730 ||
		(D >= 8733 && D <= 8736) ||
		D === 8739 ||
		D === 8741 ||
		(D >= 8743 && D <= 8748) ||
		D === 8750 ||
		(D >= 8756 && D <= 8759) ||
		D === 8764 ||
		D === 8765 ||
		D === 8776 ||
		D === 8780 ||
		D === 8786 ||
		D === 8800 ||
		D === 8801 ||
		(D >= 8804 && D <= 8807) ||
		D === 8810 ||
		D === 8811 ||
		D === 8814 ||
		D === 8815 ||
		D === 8834 ||
		D === 8835 ||
		D === 8838 ||
		D === 8839 ||
		D === 8853 ||
		D === 8857 ||
		D === 8869 ||
		D === 8895 ||
		D === 8978 ||
		(D >= 9312 && D <= 9449) ||
		(D >= 9451 && D <= 9547) ||
		(D >= 9552 && D <= 9587) ||
		(D >= 9600 && D <= 9615) ||
		(D >= 9618 && D <= 9621) ||
		D === 9632 ||
		D === 9633 ||
		(D >= 9635 && D <= 9641) ||
		D === 9650 ||
		D === 9651 ||
		D === 9654 ||
		D === 9655 ||
		D === 9660 ||
		D === 9661 ||
		D === 9664 ||
		D === 9665 ||
		(D >= 9670 && D <= 9672) ||
		D === 9675 ||
		(D >= 9678 && D <= 9681) ||
		(D >= 9698 && D <= 9701) ||
		D === 9711 ||
		D === 9733 ||
		D === 9734 ||
		D === 9737 ||
		D === 9742 ||
		D === 9743 ||
		D === 9756 ||
		D === 9758 ||
		D === 9792 ||
		D === 9794 ||
		D === 9824 ||
		D === 9825 ||
		(D >= 9827 && D <= 9829) ||
		(D >= 9831 && D <= 9834) ||
		D === 9836 ||
		D === 9837 ||
		D === 9839 ||
		D === 9886 ||
		D === 9887 ||
		D === 9919 ||
		(D >= 9926 && D <= 9933) ||
		(D >= 9935 && D <= 9939) ||
		(D >= 9941 && D <= 9953) ||
		D === 9955 ||
		D === 9960 ||
		D === 9961 ||
		(D >= 9963 && D <= 9969) ||
		D === 9972 ||
		(D >= 9974 && D <= 9977) ||
		D === 9979 ||
		D === 9980 ||
		D === 9982 ||
		D === 9983 ||
		D === 10045 ||
		(D >= 10102 && D <= 10111) ||
		(D >= 11094 && D <= 11097) ||
		(D >= 12872 && D <= 12879) ||
		(D >= 57344 && D <= 63743) ||
		(D >= 65024 && D <= 65039) ||
		D === 65533 ||
		(D >= 127232 && D <= 127242) ||
		(D >= 127248 && D <= 127277) ||
		(D >= 127280 && D <= 127337) ||
		(D >= 127344 && D <= 127373) ||
		D === 127375 ||
		D === 127376 ||
		(D >= 127387 && D <= 127404) ||
		(D >= 917760 && D <= 917999) ||
		(D >= 983040 && D <= 1048573) ||
		(D >= 1048576 && D <= 1114109)
	);
}
function cX(D) {
	return (
		D === 12288 || (D >= 65281 && D <= 65376) || (D >= 65504 && D <= 65510)
	);
}
function pX(D) {
	return (
		(D >= 4352 && D <= 4447) ||
		D === 8986 ||
		D === 8987 ||
		D === 9001 ||
		D === 9002 ||
		(D >= 9193 && D <= 9196) ||
		D === 9200 ||
		D === 9203 ||
		D === 9725 ||
		D === 9726 ||
		D === 9748 ||
		D === 9749 ||
		(D >= 9776 && D <= 9783) ||
		(D >= 9800 && D <= 9811) ||
		D === 9855 ||
		(D >= 9866 && D <= 9871) ||
		D === 9875 ||
		D === 9889 ||
		D === 9898 ||
		D === 9899 ||
		D === 9917 ||
		D === 9918 ||
		D === 9924 ||
		D === 9925 ||
		D === 9934 ||
		D === 9940 ||
		D === 9962 ||
		D === 9970 ||
		D === 9971 ||
		D === 9973 ||
		D === 9978 ||
		D === 9981 ||
		D === 9989 ||
		D === 9994 ||
		D === 9995 ||
		D === 10024 ||
		D === 10060 ||
		D === 10062 ||
		(D >= 10067 && D <= 10069) ||
		D === 10071 ||
		(D >= 10133 && D <= 10135) ||
		D === 10160 ||
		D === 10175 ||
		D === 11035 ||
		D === 11036 ||
		D === 11088 ||
		D === 11093 ||
		(D >= 11904 && D <= 11929) ||
		(D >= 11931 && D <= 12019) ||
		(D >= 12032 && D <= 12245) ||
		(D >= 12272 && D <= 12287) ||
		(D >= 12289 && D <= 12350) ||
		(D >= 12353 && D <= 12438) ||
		(D >= 12441 && D <= 12543) ||
		(D >= 12549 && D <= 12591) ||
		(D >= 12593 && D <= 12686) ||
		(D >= 12688 && D <= 12773) ||
		(D >= 12783 && D <= 12830) ||
		(D >= 12832 && D <= 12871) ||
		(D >= 12880 && D <= 42124) ||
		(D >= 42128 && D <= 42182) ||
		(D >= 43360 && D <= 43388) ||
		(D >= 44032 && D <= 55203) ||
		(D >= 63744 && D <= 64255) ||
		(D >= 65040 && D <= 65049) ||
		(D >= 65072 && D <= 65106) ||
		(D >= 65108 && D <= 65126) ||
		(D >= 65128 && D <= 65131) ||
		(D >= 94176 && D <= 94180) ||
		D === 94192 ||
		D === 94193 ||
		(D >= 94208 && D <= 100343) ||
		(D >= 100352 && D <= 101589) ||
		(D >= 101631 && D <= 101640) ||
		(D >= 110576 && D <= 110579) ||
		(D >= 110581 && D <= 110587) ||
		D === 110589 ||
		D === 110590 ||
		(D >= 110592 && D <= 110882) ||
		D === 110898 ||
		(D >= 110928 && D <= 110930) ||
		D === 110933 ||
		(D >= 110948 && D <= 110951) ||
		(D >= 110960 && D <= 111355) ||
		(D >= 119552 && D <= 119638) ||
		(D >= 119648 && D <= 119670) ||
		D === 126980 ||
		D === 127183 ||
		D === 127374 ||
		(D >= 127377 && D <= 127386) ||
		(D >= 127488 && D <= 127490) ||
		(D >= 127504 && D <= 127547) ||
		(D >= 127552 && D <= 127560) ||
		D === 127568 ||
		D === 127569 ||
		(D >= 127584 && D <= 127589) ||
		(D >= 127744 && D <= 127776) ||
		(D >= 127789 && D <= 127797) ||
		(D >= 127799 && D <= 127868) ||
		(D >= 127870 && D <= 127891) ||
		(D >= 127904 && D <= 127946) ||
		(D >= 127951 && D <= 127955) ||
		(D >= 127968 && D <= 127984) ||
		D === 127988 ||
		(D >= 127992 && D <= 128062) ||
		D === 128064 ||
		(D >= 128066 && D <= 128252) ||
		(D >= 128255 && D <= 128317) ||
		(D >= 128331 && D <= 128334) ||
		(D >= 128336 && D <= 128359) ||
		D === 128378 ||
		D === 128405 ||
		D === 128406 ||
		D === 128420 ||
		(D >= 128507 && D <= 128591) ||
		(D >= 128640 && D <= 128709) ||
		D === 128716 ||
		(D >= 128720 && D <= 128722) ||
		(D >= 128725 && D <= 128727) ||
		(D >= 128732 && D <= 128735) ||
		D === 128747 ||
		D === 128748 ||
		(D >= 128756 && D <= 128764) ||
		(D >= 128992 && D <= 129003) ||
		D === 129008 ||
		(D >= 129292 && D <= 129338) ||
		(D >= 129340 && D <= 129349) ||
		(D >= 129351 && D <= 129535) ||
		(D >= 129648 && D <= 129660) ||
		(D >= 129664 && D <= 129673) ||
		(D >= 129679 && D <= 129734) ||
		(D >= 129742 && D <= 129756) ||
		(D >= 129759 && D <= 129769) ||
		(D >= 129776 && D <= 129784) ||
		(D >= 131072 && D <= 196605) ||
		(D >= 196608 && D <= 262141)
	);
}
function zR(D) {
	if (!Number.isSafeInteger(D))
		throw new TypeError(`Expected a code point, got \`${typeof D}\`.`);
}
function V8(D, { ambiguousAsWide: F = !1 } = {}) {
	if ((zR(D), cX(D) || pX(D) || (F && dX(D)))) return 2;
	return 1;
}
var aX = () => {
	return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE89\uDE8F-\uDEC2\uDEC6\uDECE-\uDEDC\uDEDF-\uDEE9]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
};
var AR = new Intl.Segmenter(),
	LR = /^\p{Default_Ignorable_Code_Point}$/u;
function CD(D, F = {}) {
	if (typeof D !== "string" || D.length === 0) return 0;
	let { ambiguousIsNarrow: _ = !0, countAnsiEscapeCodes: B = !1 } = F;
	if (!B) D = VD(D);
	if (D.length === 0) return 0;
	let $ = 0,
		Z = { ambiguousAsWide: !_ };
	for (let { segment: q } of AR.segment(D)) {
		let X = q.codePointAt(0);
		if (X <= 31 || (X >= 127 && X <= 159)) continue;
		if ((X >= 8203 && X <= 8207) || X === 65279) continue;
		if (
			(X >= 768 && X <= 879) ||
			(X >= 6832 && X <= 6911) ||
			(X >= 7616 && X <= 7679) ||
			(X >= 8400 && X <= 8447) ||
			(X >= 65056 && X <= 65071)
		)
			continue;
		if (X >= 55296 && X <= 57343) continue;
		if (X >= 65024 && X <= 65039) continue;
		if (LR.test(q)) continue;
		if (aX().test(q)) {
			$ += 2;
			continue;
		}
		$ += V8(X, Z);
	}
	return $;
}
function L4({ stream: D = process.stdout } = {}) {
	return Boolean(
		D && D.isTTY && process.env.TERM !== "dumb" && !("CI" in process.env),
	);
}
import iX from "process";
function G4() {
	let { env: D } = iX,
		{ TERM: F, TERM_PROGRAM: _ } = D;
	if (iX.platform !== "win32") return F !== "linux";
	return (
		Boolean(D.WT_SESSION) ||
		Boolean(D.TERMINUS_SUBLIME) ||
		D.ConEmuTask === "{cmd::Cmder}" ||
		_ === "Terminus-Sublime" ||
		_ === "vscode" ||
		F === "xterm-256color" ||
		F === "alacritty" ||
		F === "rxvt-unicode" ||
		F === "rxvt-unicode-256color" ||
		D.TERMINAL_EMULATOR === "JetBrains-JediTerm"
	);
}
import i0 from "process";
var GR = 3;
class sX {
	#Z = 0;
	start() {
		if ((this.#Z++, this.#Z === 1)) this.#_();
	}
	stop() {
		if (this.#Z <= 0) throw new Error("`stop` called more times than `start`");
		if ((this.#Z--, this.#Z === 0)) this.#D();
	}
	#_() {
		if (i0.platform === "win32" || !i0.stdin.isTTY) return;
		i0.stdin.setRawMode(!0), i0.stdin.on("data", this.#$), i0.stdin.resume();
	}
	#D() {
		if (!i0.stdin.isTTY) return;
		i0.stdin.off("data", this.#$), i0.stdin.pause(), i0.stdin.setRawMode(!1);
	}
	#$(D) {
		if (D[0] === GR) i0.emit("SIGINT");
	}
}
var VR = new sX(),
	V4 = VR;
var CR = s0(J4(), 1);
class rX {
	#Z = 0;
	#_ = !1;
	#D = 0;
	#$ = -1;
	#L = 0;
	#F;
	#q;
	#B;
	#G;
	#C;
	#J;
	#z;
	#A;
	#W;
	#X;
	#Q;
	color;
	constructor(D) {
		if (typeof D === "string") D = { text: D };
		if (
			((this.#F = {
				color: "cyan",
				stream: C8.stderr,
				discardStdin: !0,
				hideCursor: !0,
				...D,
			}),
			(this.color = this.#F.color),
			(this.spinner = this.#F.spinner),
			(this.#C = this.#F.interval),
			(this.#B = this.#F.stream),
			(this.#J =
				typeof this.#F.isEnabled === "boolean"
					? this.#F.isEnabled
					: L4({ stream: this.#B })),
			(this.#z = typeof this.#F.isSilent === "boolean" ? this.#F.isSilent : !1),
			(this.text = this.#F.text),
			(this.prefixText = this.#F.prefixText),
			(this.suffixText = this.#F.suffixText),
			(this.indent = this.#F.indent),
			C8.env.NODE_ENV === "test")
		)
			(this._stream = this.#B),
				(this._isEnabled = this.#J),
				Object.defineProperty(this, "_linesToClear", {
					get() {
						return this.#Z;
					},
					set(F) {
						this.#Z = F;
					},
				}),
				Object.defineProperty(this, "_frameIndex", {
					get() {
						return this.#$;
					},
				}),
				Object.defineProperty(this, "_lineCount", {
					get() {
						return this.#D;
					},
				});
	}
	get indent() {
		return this.#A;
	}
	set indent(D = 0) {
		if (!(D >= 0 && Number.isInteger(D)))
			throw new Error("The `indent` option must be an integer from 0 and up");
		(this.#A = D), this.#V();
	}
	get interval() {
		return this.#C ?? this.#q.interval ?? 100;
	}
	get spinner() {
		return this.#q;
	}
	set spinner(D) {
		if (((this.#$ = -1), (this.#C = void 0), typeof D === "object")) {
			if (D.frames === void 0)
				throw new Error("The given spinner must have a `frames` property");
			this.#q = D;
		} else if (!G4()) this.#q = e1.default.line;
		else if (D === void 0) this.#q = e1.default.dots;
		else if (D !== "default" && e1.default[D]) this.#q = e1.default[D];
		else
			throw new Error(
				`There is no built-in spinner named '${D}'. See https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json for a full list.`,
			);
	}
	get text() {
		return this.#W;
	}
	set text(D = "") {
		(this.#W = D), this.#V();
	}
	get prefixText() {
		return this.#X;
	}
	set prefixText(D = "") {
		(this.#X = D), this.#V();
	}
	get suffixText() {
		return this.#Q;
	}
	set suffixText(D = "") {
		(this.#Q = D), this.#V();
	}
	get isSpinning() {
		return this.#G !== void 0;
	}
	#H(D = this.#X, F = " ") {
		if (typeof D === "string" && D !== "") return D + F;
		if (typeof D === "function") return D() + F;
		return "";
	}
	#K(D = this.#Q, F = " ") {
		if (typeof D === "string" && D !== "") return F + D;
		if (typeof D === "function") return F + D();
		return "";
	}
	#V() {
		let D = this.#B.columns ?? 80,
			F = this.#H(this.#X, "-"),
			_ = this.#K(this.#Q, "-"),
			B = " ".repeat(this.#A) + F + "--" + this.#W + "--" + _;
		this.#D = 0;
		for (let $ of VD(B).split(`
`))
			this.#D += Math.max(
				1,
				Math.ceil(CD($, { countAnsiEscapeCodes: !0 }) / D),
			);
	}
	get isEnabled() {
		return this.#J && !this.#z;
	}
	set isEnabled(D) {
		if (typeof D !== "boolean")
			throw new TypeError("The `isEnabled` option must be a boolean");
		this.#J = D;
	}
	get isSilent() {
		return this.#z;
	}
	set isSilent(D) {
		if (typeof D !== "boolean")
			throw new TypeError("The `isSilent` option must be a boolean");
		this.#z = D;
	}
	frame() {
		let D = Date.now();
		if (this.#$ === -1 || D - this.#L >= this.interval)
			(this.#$ = ++this.#$ % this.#q.frames.length), (this.#L = D);
		let { frames: F } = this.#q,
			_ = F[this.#$];
		if (this.color) _ = U[this.color](_);
		let B = typeof this.#X === "string" && this.#X !== "" ? this.#X + " " : "",
			$ = typeof this.text === "string" ? " " + this.text : "",
			Z = typeof this.#Q === "string" && this.#Q !== "" ? " " + this.#Q : "";
		return B + _ + $ + Z;
	}
	clear() {
		if (!this.#J || !this.#B.isTTY) return this;
		this.#B.cursorTo(0);
		for (let D = 0; D < this.#Z; D++) {
			if (D > 0) this.#B.moveCursor(0, -1);
			this.#B.clearLine(1);
		}
		if (this.#A || this.lastIndent !== this.#A) this.#B.cursorTo(this.#A);
		return (this.lastIndent = this.#A), (this.#Z = 0), this;
	}
	render() {
		if (this.#z) return this;
		return this.clear(), this.#B.write(this.frame()), (this.#Z = this.#D), this;
	}
	start(D) {
		if (D) this.text = D;
		if (this.#z) return this;
		if (!this.#J) {
			if (this.text)
				this.#B.write(`- ${this.text}
`);
			return this;
		}
		if (this.isSpinning) return this;
		if (this.#F.hideCursor) s2.hide(this.#B);
		if (this.#F.discardStdin && C8.stdin.isTTY) (this.#_ = !0), V4.start();
		return (
			this.render(),
			(this.#G = setInterval(this.render.bind(this), this.interval)),
			this
		);
	}
	stop() {
		if (!this.#J) return this;
		if (
			(clearInterval(this.#G),
			(this.#G = void 0),
			(this.#$ = 0),
			this.clear(),
			this.#F.hideCursor)
		)
			s2.show(this.#B);
		if (this.#F.discardStdin && C8.stdin.isTTY && this.#_)
			V4.stop(), (this.#_ = !1);
		return this;
	}
	succeed(D) {
		return this.stopAndPersist({ symbol: t1.success, text: D });
	}
	fail(D) {
		return this.stopAndPersist({ symbol: t1.error, text: D });
	}
	warn(D) {
		return this.stopAndPersist({ symbol: t1.warning, text: D });
	}
	info(D) {
		return this.stopAndPersist({ symbol: t1.info, text: D });
	}
	stopAndPersist(D = {}) {
		if (this.#z) return this;
		let F = D.prefixText ?? this.#X,
			_ = this.#H(F, " "),
			B = D.symbol ?? " ",
			$ = D.text ?? this.text,
			q = typeof $ === "string" ? (B ? " " : "") + $ : "",
			X = D.suffixText ?? this.#Q,
			Q = this.#K(X, " "),
			J =
				_ +
				B +
				q +
				Q +
				`
`;
		return this.stop(), this.#B.write(J), this;
	}
}
function DF(D) {
	return new rX(D);
}
var oX = {
	filesToRemove: ["CHANGELOG.md", ".codesandbox", "go.sum"],
	fileUpdaters: {
		"go.mod": async (D, { name: F }) => {
			let B = (await W8.readFile(D, "utf-8")).replace(
				/module\s+.+/,
				`module ${F}`,
			);
			await W8.writeFile(D, B, "utf-8");
		},
	},
};
class C4 {
	projectDir;
	projectName;
	constructor(D, F) {
		(this.projectDir = D), (this.projectName = F);
	}
	createSpinner(D) {
		return DF({ text: U.dim(D), spinner: "dots" });
	}
	async execCommand(D, F) {
		return new Promise((_, B) => {
			let $ = this.createSpinner(F);
			$.start();
			let Z = WR(D, { cwd: this.projectDir });
			Z.stdout?.on("data", (q) => {
				$.text = `${F} ${U.dim(q.toString().trim())}`;
			}),
				Z.stderr?.on("data", (q) => {
					$.text = `${F} ${U.yellow(q.toString().trim())}`;
				}),
				Z.on("close", (q) => {
					if (q === 0)
						$.stop(),
							f0("Success", "Go dependencies installed successfully"),
							_();
					else
						$.fail(U.red("Go dependency installation failed")),
							B(new Error(`Installation failed with code ${q}`));
				});
		});
	}
	async removeFiles() {
		let D = oX.filesToRemove.map(async (F) => {
			let _ = nX.resolve(this.projectDir, F);
			try {
				await W8.rm(_, { recursive: !0, force: !0 });
			} catch (B) {
				if (B.code !== "ENOENT") throw B;
			}
		});
		await Promise.all(D);
	}
	async updateFiles() {
		let D = Object.entries(oX.fileUpdaters).map(async ([F, _]) => {
			let B = nX.resolve(this.projectDir, F);
			try {
				if (
					await W8.access(B)
						.then(() => !0)
						.catch(() => !1)
				)
					await _(B, { name: this.projectName });
			} catch ($) {
				throw new Error(`Failed to update ${F}: ${$.message}`);
			}
		});
		await Promise.all(D);
	}
	async installDependencies() {
		try {
			await this.execCommand(
				"go mod tidy",
				"Wait a moment, installing Go dependencies...",
			);
		} catch (D) {
			throw new Error(`Failed to install Go dependencies: ${D.message}`);
		}
	}
	async processFiles() {
		try {
			await this.removeFiles(), await this.updateFiles();
		} catch (D) {
			throw new Error(`Failed to process Go project files: ${D.message}`);
		}
	}
}
async function tX(D) {
	await new C4(D, "").installDependencies();
}
async function eX(D, F) {
	await new C4(D, F).processFiles();
}
import { exec as HR } from "child_process";
import H8 from "fs/promises";
import DQ from "path";
var FQ = {
	filesToRemove: ["CHANGELOG.md", ".codesandbox"],
	fileUpdaters: {
		"package.json": async (D, { name: F }) => {
			let _ = await H8.readFile(D, "utf-8"),
				B = /(^\s+)/m.exec(_)?.[1] ?? "  ",
				Z = { ...JSON.parse(_), name: F, private: void 0 };
			await H8.writeFile(
				D,
				`${JSON.stringify(Z, null, B)}
`,
				"utf-8",
			);
		},
	},
};
class W4 {
	projectDir;
	projectName;
	constructor(D, F) {
		(this.projectDir = D), (this.projectName = F);
	}
	createSpinner(D) {
		return DF({ text: U.dim(D), spinner: "dots" });
	}
	async execCommand(D) {
		return new Promise((F, _) => {
			let B = this.createSpinner("Installing dependencies...");
			B.start();
			let $ = HR(D, { cwd: this.projectDir });
			$.stdout?.on("data", (Z) => {
				B.text = `Installing... ${U.dim(Z.toString().trim())}`;
			}),
				$.stderr?.on("data", (Z) => {
					B.text = `Installing... ${U.yellow(Z.toString().trim())}`;
				}),
				$.on("close", (Z) => {
					if (Z === 0)
						B.stop(), f0("Success", "Dependencies installed successfully"), F();
					else
						B.fail(U.red("Installation failed")),
							_(new Error(`Installation failed with code ${Z}`));
				});
		});
	}
	async removeFiles() {
		let D = FQ.filesToRemove.map(async (F) => {
			let _ = DQ.resolve(this.projectDir, F);
			try {
				await H8.rm(_, { recursive: !0, force: !0 });
			} catch (B) {
				if (B.code !== "ENOENT") throw B;
			}
		});
		await Promise.all(D);
	}
	async updateFiles() {
		let D = Object.entries(FQ.fileUpdaters).map(async ([F, _]) => {
			let B = DQ.resolve(this.projectDir, F);
			try {
				if (
					await H8.access(B)
						.then(() => !0)
						.catch(() => !1)
				)
					await _(B, { name: this.projectName });
			} catch ($) {
				throw new Error(`Failed to update ${F}: ${$.message}`);
			}
		});
		await Promise.all(D);
	}
	async installDependencies() {
		try {
			await this.execCommand("bun install");
		} catch (D) {
			throw new Error(`Failed to install dependencies: ${D.message}`);
		}
	}
	async processFiles() {
		try {
			await this.removeFiles(), await this.updateFiles();
		} catch (D) {
			throw new Error(`Failed to process project files: ${D.message}`);
		}
	}
}
async function _Q(D) {
	await new W4(D, "").installDependencies();
}
async function BQ(D, F) {
	await new W4(D, F).processFiles();
}
class $Q {
	paths;
	options;
	constructor(D) {
		let F = process.cwd();
		(this.options = D),
			(this.paths = {
				tempDir: Y8.join(F, ".temp-clone"),
				projectDir: Y8.join(F, D.projectName),
				templatePath: Y8.join(F, ".temp-clone", "code", D.tmpl),
			});
	}
	async ensureDirectory(D) {
		try {
			await K8.mkdir(D, { recursive: !0 });
		} catch (F) {
			throw new Error(`Failed to create directory ${D}: ${F.message}`);
		}
	}
	async cleanDirectory(D) {
		try {
			await K8.rm(D, { recursive: !0, force: !0 }).catch(() => {});
		} catch (F) {
			console.warn(U.yellow(`Warning: Failed to clean directory ${D}`));
		}
	}
	async copyConfig() {
		let { tmpl: D, projectName: F } = this.options,
			_ = Y8.join(this.paths.projectDir, ".lokio.yaml");
		try {
			let { CONFIG_YAML: B } = await Q8(),
				Z = (await B(D)).replace(/package:\s*.+/, `package: ${F}`);
			await K8.writeFile(_, Z, "utf8"),
				console.log(U.green("\u2713 Configuration file copied successfully"));
		} catch (B) {
			if (B.code === "ENOENT") {
				console.warn(
					U.yellow(`\u26A0\uFE0F Configuration file not found: ${B}`),
				);
				return;
			}
			throw new Error(`Failed to copy configuration: ${B.message}`);
		}
	}
	async processLanguageSpecific() {
		let { lang: D, install: F } = this.options,
			{ projectDir: _ } = this.paths;
		await {
			ts: async () => {
				if ((await BQ(_, this.options.projectName), F)) await _Q(_);
			},
			go: async () => {
				if ((await eX(_, this.options.projectName), F)) await tX(_);
			},
			kt: async () => {},
		}[D]();
	}
	async execute() {
		let { tempDir: D, projectDir: F, templatePath: _ } = this.paths;
		try {
			console.log(U.blue("\uD83D\uDE80 Starting template setup...")),
				await this.cleanDirectory(D),
				await this.ensureDirectory(F),
				await NX(X0.GUTHUB.LOKIO_TEMPLATE, D),
				await K8.cp(_, F, { recursive: !0 }),
				console.log(U.green("\u2713 Template files copied")),
				await this.copyConfig(),
				await this.processLanguageSpecific(),
				await this.cleanDirectory(D),
				console.log(
					U.green(`
\uD83C\uDF89 Success! Project ${this.options.projectName} is ready!`),
				);
		} catch (B) {
			throw (
				(console.error(
					U.red(`
\u274C Template creation failed:`),
				),
				console.error(U.red(B.message)),
				await this.cleanDirectory(D),
				B)
			);
		}
	}
}
async function H4(D) {
	await new $Q(D).execute();
}
var qQ = async (D) => {
	D.command("create")
		.alias("c")
		.description(Z0.PROGRAM.CREATE_DESCRIPTION)
		.action(async () => {
			let F = await aB(),
				_ = await dB(),
				B = await pB(),
				$ = _.lang;
			await H4({ install: B, projectName: F, tmpl: _.value, lang: $ });
		});
};
import IQ from "readline";
var ZQ = (D, F) => {
	if (D.meta && D.name !== "escape") return;
	if (D.ctrl) {
		if (D.name === "a") return "first";
		if (D.name === "c") return "abort";
		if (D.name === "d") return "abort";
		if (D.name === "e") return "last";
		if (D.name === "g") return "reset";
	}
	if (F) {
		if (D.name === "j") return "down";
		if (D.name === "k") return "up";
		if (D.ctrl && D.name === "n") return "down";
		if (D.ctrl && D.name === "p") return "up";
	}
	if (D.name === "return") return "submit";
	if (D.name === "enter") return "submit";
	if (D.name === "backspace") return "delete";
	if (D.name === "delete") return "deleteForward";
	if (D.name === "abort") return "abort";
	if (D.name === "escape") return "exit";
	if (D.name === "tab") return "next";
	if (D.name === "pagedown") return "nextPage";
	if (D.name === "pageup") return "prevPage";
	if (D.name === "home") return "home";
	if (D.name === "end") return "end";
	if (D.name === "up") return "up";
	if (D.name === "down") return "down";
	if (D.name === "right") return "right";
	if (D.name === "left") return "left";
	return !1;
};
import YQ from "process";
var $F = {};
uQ($F, {
	scrollUp: () => yR,
	scrollDown: () => kR,
	link: () => cR,
	image: () => pR,
	iTerm: () => aR,
	exitAlternativeScreen: () => lR,
	eraseUp: () => vR,
	eraseStartLine: () => bR,
	eraseScreen: () => K4,
	eraseLines: () => ER,
	eraseLine: () => zQ,
	eraseEndLine: () => xR,
	eraseDown: () => gR,
	enterAlternativeScreen: () => hR,
	cursorUp: () => QQ,
	cursorTo: () => IR,
	cursorShow: () => SR,
	cursorSavePosition: () => TR,
	cursorRestorePosition: () => OR,
	cursorPrevLine: () => uR,
	cursorNextLine: () => jR,
	cursorMove: () => UR,
	cursorLeft: () => JQ,
	cursorHide: () => NR,
	cursorGetPosition: () => wR,
	cursorForward: () => RR,
	cursorDown: () => MR,
	cursorBackward: () => PR,
	clearTerminal: () => mR,
	clearScreen: () => fR,
	beep: () => dR,
});
import Y4 from "process";
var I8 = globalThis.window?.document !== void 0,
	NN = globalThis.process?.versions?.node !== void 0,
	SN = globalThis.process?.versions?.bun !== void 0,
	EN = globalThis.Deno?.version?.deno !== void 0,
	xN = globalThis.process?.versions?.electron !== void 0,
	bN = globalThis.navigator?.userAgent?.includes("jsdom") === !0,
	gN =
		typeof WorkerGlobalScope !== "undefined" &&
		globalThis instanceof WorkerGlobalScope,
	vN =
		typeof DedicatedWorkerGlobalScope !== "undefined" &&
		globalThis instanceof DedicatedWorkerGlobalScope,
	yN =
		typeof SharedWorkerGlobalScope !== "undefined" &&
		globalThis instanceof SharedWorkerGlobalScope,
	kN =
		typeof ServiceWorkerGlobalScope !== "undefined" &&
		globalThis instanceof ServiceWorkerGlobalScope,
	FF = globalThis.navigator?.userAgentData?.platform,
	fN =
		FF === "macOS" ||
		globalThis.navigator?.platform === "MacIntel" ||
		globalThis.navigator?.userAgent?.includes(" Mac ") === !0 ||
		globalThis.process?.platform === "darwin",
	mN =
		FF === "Windows" ||
		globalThis.navigator?.platform === "Win32" ||
		globalThis.process?.platform === "win32",
	hN =
		FF === "Linux" ||
		globalThis.navigator?.platform?.startsWith("Linux") === !0 ||
		globalThis.navigator?.userAgent?.includes(" Linux ") === !0 ||
		globalThis.process?.platform === "linux",
	lN =
		FF === "iOS" ||
		(globalThis.navigator?.platform === "MacIntel" &&
			globalThis.navigator?.maxTouchPoints > 1) ||
		/iPad|iPhone|iPod/.test(globalThis.navigator?.platform),
	dN =
		FF === "Android" ||
		globalThis.navigator?.platform === "Android" ||
		globalThis.navigator?.userAgent?.includes(" Android ") === !0 ||
		globalThis.process?.platform === "android";
var E = "\x1B[",
	BF = "\x1B]",
	r2 = "\x07",
	_F = ";",
	XQ = !I8 && Y4.env.TERM_PROGRAM === "Apple_Terminal",
	KR = !I8 && Y4.platform === "win32",
	YR = I8
		? () => {
				throw new Error(
					"`process.cwd()` only works in Node.js, not the browser.",
				);
			}
		: Y4.cwd,
	IR = (D, F) => {
		if (typeof D !== "number")
			throw new TypeError("The `x` argument is required");
		if (typeof F !== "number") return E + (D + 1) + "G";
		return E + (F + 1) + _F + (D + 1) + "H";
	},
	UR = (D, F) => {
		if (typeof D !== "number")
			throw new TypeError("The `x` argument is required");
		let _ = "";
		if (D < 0) _ += E + -D + "D";
		else if (D > 0) _ += E + D + "C";
		if (F < 0) _ += E + -F + "A";
		else if (F > 0) _ += E + F + "B";
		return _;
	},
	QQ = (D = 1) => E + D + "A",
	MR = (D = 1) => E + D + "B",
	RR = (D = 1) => E + D + "C",
	PR = (D = 1) => E + D + "D",
	JQ = E + "G",
	TR = XQ ? "\x1B7" : E + "s",
	OR = XQ ? "\x1B8" : E + "u",
	wR = E + "6n",
	jR = E + "E",
	uR = E + "F",
	NR = E + "?25l",
	SR = E + "?25h",
	ER = (D) => {
		let F = "";
		for (let _ = 0; _ < D; _++) F += zQ + (_ < D - 1 ? QQ() : "");
		if (D) F += JQ;
		return F;
	},
	xR = E + "K",
	bR = E + "1K",
	zQ = E + "2K",
	gR = E + "J",
	vR = E + "1J",
	K4 = E + "2J",
	yR = E + "S",
	kR = E + "T",
	fR = "\x1Bc",
	mR = KR ? `${K4}${E}0f` : `${K4}${E}3J${E}H`,
	hR = E + "?1049h",
	lR = E + "?1049l",
	dR = r2,
	cR = (D, F) => [BF, "8", _F, _F, F, r2, D, BF, "8", _F, _F, r2].join(""),
	pR = (D, F = {}) => {
		let _ = `${BF}1337;File=inline=1`;
		if (F.width) _ += `;width=${F.width}`;
		if (F.height) _ += `;height=${F.height}`;
		if (F.preserveAspectRatio === !1) _ += ";preserveAspectRatio=0";
		return _ + ":" + Buffer.from(D).toString("base64") + r2;
	},
	aR = {
		setCwd: (D = YR()) => `${BF}50;CurrentDir=${D}${r2}`,
		annotation(D, F = {}) {
			let _ = `${BF}1337;`,
				B = F.x !== void 0,
				$ = F.y !== void 0;
			if ((B || $) && !(B && $ && F.length !== void 0))
				throw new Error(
					"`x`, `y` and `length` must be defined when `x` or `y` is defined",
				);
			if (
				((D = D.replaceAll("|", "")),
				(_ += F.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation="),
				F.length > 0)
			)
				_ += (B ? [D, F.length, F.x, F.y] : [F.length, D]).join("|");
			else _ += D;
			return _ + r2;
		},
	};
var AQ =
		(D = 0) =>
		(F) =>
			`\x1B[${F + D}m`,
	LQ =
		(D = 0) =>
		(F) =>
			`\x1B[${38 + D};5;${F}m`,
	GQ =
		(D = 0) =>
		(F, _, B) =>
			`\x1B[${38 + D};2;${F};${_};${B}m`,
	m = {
		modifier: {
			reset: [0, 0],
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			overline: [53, 55],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29],
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			blackBright: [90, 39],
			gray: [90, 39],
			grey: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39],
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],
			bgBlackBright: [100, 49],
			bgGray: [100, 49],
			bgGrey: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49],
		},
	},
	rN = Object.keys(m.modifier),
	iR = Object.keys(m.color),
	sR = Object.keys(m.bgColor),
	nN = [...iR, ...sR];
function rR() {
	let D = new Map();
	for (let [F, _] of Object.entries(m)) {
		for (let [B, $] of Object.entries(_))
			(m[B] = { open: `\x1B[${$[0]}m`, close: `\x1B[${$[1]}m` }),
				(_[B] = m[B]),
				D.set($[0], $[1]);
		Object.defineProperty(m, F, { value: _, enumerable: !1 });
	}
	return (
		Object.defineProperty(m, "codes", { value: D, enumerable: !1 }),
		(m.color.close = "\x1B[39m"),
		(m.bgColor.close = "\x1B[49m"),
		(m.color.ansi = AQ()),
		(m.color.ansi256 = LQ()),
		(m.color.ansi16m = GQ()),
		(m.bgColor.ansi = AQ(10)),
		(m.bgColor.ansi256 = LQ(10)),
		(m.bgColor.ansi16m = GQ(10)),
		Object.defineProperties(m, {
			rgbToAnsi256: {
				value: (F, _, B) => {
					if (F === _ && _ === B) {
						if (F < 8) return 16;
						if (F > 248) return 231;
						return Math.round(((F - 8) / 247) * 24) + 232;
					}
					return (
						16 +
						36 * Math.round((F / 255) * 5) +
						6 * Math.round((_ / 255) * 5) +
						Math.round((B / 255) * 5)
					);
				},
				enumerable: !1,
			},
			hexToRgb: {
				value: (F) => {
					let _ = /[a-f\d]{6}|[a-f\d]{3}/i.exec(F.toString(16));
					if (!_) return [0, 0, 0];
					let [B] = _;
					if (B.length === 3) B = [...B].map((Z) => Z + Z).join("");
					let $ = Number.parseInt(B, 16);
					return [($ >> 16) & 255, ($ >> 8) & 255, $ & 255];
				},
				enumerable: !1,
			},
			hexToAnsi256: {
				value: (F) => m.rgbToAnsi256(...m.hexToRgb(F)),
				enumerable: !1,
			},
			ansi256ToAnsi: {
				value: (F) => {
					if (F < 8) return 30 + F;
					if (F < 16) return 90 + (F - 8);
					let _, B, $;
					if (F >= 232) (_ = ((F - 232) * 10 + 8) / 255), (B = _), ($ = _);
					else {
						F -= 16;
						let X = F % 36;
						(_ = Math.floor(F / 36) / 5),
							(B = Math.floor(X / 6) / 5),
							($ = (X % 6) / 5);
					}
					let Z = Math.max(_, B, $) * 2;
					if (Z === 0) return 30;
					let q =
						30 + ((Math.round($) << 2) | (Math.round(B) << 1) | Math.round(_));
					if (Z === 2) q += 60;
					return q;
				},
				enumerable: !1,
			},
			rgbToAnsi: {
				value: (F, _, B) => m.ansi256ToAnsi(m.rgbToAnsi256(F, _, B)),
				enumerable: !1,
			},
			hexToAnsi: {
				value: (F) => m.ansi256ToAnsi(m.hexToAnsi256(F)),
				enumerable: !1,
			},
		}),
		m
	);
}
var nR = rR(),
	x0 = nR;
var M8 = new Set(["\x1B", "\x9B"]),
	oR = 39,
	U4 = "\x07",
	WQ = "[",
	tR = "]",
	HQ = "m",
	U8 = `${tR}8;;`,
	VQ = (D) => `${M8.values().next().value}${WQ}${D}${HQ}`,
	CQ = (D) => `${M8.values().next().value}${U8}${D}${U4}`,
	eR = (D) => D.split(" ").map((F) => CD(F)),
	I4 = (D, F, _) => {
		let B = [...F],
			$ = !1,
			Z = !1,
			q = CD(VD(D.at(-1)));
		for (let [X, Q] of B.entries()) {
			let J = CD(Q);
			if (q + J <= _) D[D.length - 1] += Q;
			else D.push(Q), (q = 0);
			if (M8.has(Q))
				($ = !0), (Z = B.slice(X + 1, X + 1 + U8.length).join("") === U8);
			if ($) {
				if (Z) {
					if (Q === U4) ($ = !1), (Z = !1);
				} else if (Q === HQ) $ = !1;
				continue;
			}
			if (((q += J), q === _ && X < B.length - 1)) D.push(""), (q = 0);
		}
		if (!q && D.at(-1).length > 0 && D.length > 1) D[D.length - 2] += D.pop();
	},
	DP = (D) => {
		let F = D.split(" "),
			_ = F.length;
		while (_ > 0) {
			if (CD(F[_ - 1]) > 0) break;
			_--;
		}
		if (_ === F.length) return D;
		return F.slice(0, _).join(" ") + F.slice(_).join("");
	},
	FP = (D, F, _ = {}) => {
		if (_.trim !== !1 && D.trim() === "") return "";
		let B = "",
			$,
			Z,
			q = eR(D),
			X = [""];
		for (let [A, L] of D.split(" ").entries()) {
			if (_.trim !== !1) X[X.length - 1] = X.at(-1).trimStart();
			let G = CD(X.at(-1));
			if (A !== 0) {
				if (G >= F && (_.wordWrap === !1 || _.trim === !1)) X.push(""), (G = 0);
				if (G > 0 || _.trim === !1) (X[X.length - 1] += " "), G++;
			}
			if (_.hard && q[A] > F) {
				let H = F - G,
					V = 1 + Math.floor((q[A] - H - 1) / F);
				if (Math.floor((q[A] - 1) / F) < V) X.push("");
				I4(X, L, F);
				continue;
			}
			if (G + q[A] > F && G > 0 && q[A] > 0) {
				if (_.wordWrap === !1 && G < F) {
					I4(X, L, F);
					continue;
				}
				X.push("");
			}
			if (G + q[A] > F && _.wordWrap === !1) {
				I4(X, L, F);
				continue;
			}
			X[X.length - 1] += L;
		}
		if (_.trim !== !1) X = X.map((A) => DP(A));
		let Q = X.join(`
`),
			J = [...Q],
			z = 0;
		for (let [A, L] of J.entries()) {
			if (((B += L), M8.has(L))) {
				let { groups: H } = new RegExp(
					`(?:\\${WQ}(?<code>\\d+)m|\\${U8}(?<uri>.*)${U4})`,
				).exec(Q.slice(z)) || { groups: {} };
				if (H.code !== void 0) {
					let V = Number.parseFloat(H.code);
					$ = V === oR ? void 0 : V;
				} else if (H.uri !== void 0) Z = H.uri.length === 0 ? void 0 : H.uri;
			}
			let G = x0.codes.get(Number($));
			if (
				J[A + 1] ===
				`
`
			) {
				if (Z) B += CQ("");
				if ($ && G) B += VQ(G);
			} else if (
				L ===
				`
`
			) {
				if ($ && G) B += VQ($);
				if (Z) B += CQ(Z);
			}
			z += L.length;
		}
		return B;
	};
function M4(D, F, _) {
	return String(D)
		.normalize()
		.replaceAll(
			`\r
`,
			`
`,
		)
		.split(`
`)
		.map((B) => FP(B, F, _))
		.join(`
`);
}
function R4(D) {
	if (!Number.isInteger(D)) return !1;
	return V8(D) === 2;
}
var _P = new Set([27, 155]),
	BP = "0".codePointAt(0),
	$P = "9".codePointAt(0),
	T4 = new Set(),
	P4 = new Map();
for (let [D, F] of x0.codes)
	T4.add(x0.color.ansi(F)), P4.set(x0.color.ansi(D), x0.color.ansi(F));
function qP(D) {
	if (T4.has(D)) return D;
	if (P4.has(D)) return P4.get(D);
	if (((D = D.slice(2)), D.includes(";"))) D = D[0] + "0";
	let F = x0.codes.get(Number.parseInt(D, 10));
	if (F) return x0.color.ansi(F);
	return x0.reset.open;
}
function ZP(D) {
	for (let F = 0; F < D.length; F++) {
		let _ = D.codePointAt(F);
		if (_ >= BP && _ <= $P) return F;
	}
	return -1;
}
function XP(D, F) {
	D = D.slice(F, F + 19);
	let _ = ZP(D);
	if (_ !== -1) {
		let B = D.indexOf("m", _);
		if (B === -1) B = D.length;
		return D.slice(0, B + 1);
	}
}
function QP(D, F = Number.POSITIVE_INFINITY) {
	let _ = [],
		B = 0,
		$ = 0;
	while (B < D.length) {
		let Z = D.codePointAt(B);
		if (_P.has(Z)) {
			let Q = XP(D, B);
			if (Q) {
				_.push({ type: "ansi", code: Q, endCode: qP(Q) }), (B += Q.length);
				continue;
			}
		}
		let q = R4(Z),
			X = String.fromCodePoint(Z);
		if (
			(_.push({ type: "character", value: X, isFullWidth: q }),
			(B += X.length),
			($ += q ? 2 : X.length),
			$ >= F)
		)
			break;
	}
	return _;
}
function KQ(D) {
	let F = [];
	for (let _ of D)
		if (_.code === x0.reset.open) F = [];
		else if (T4.has(_.code)) F = F.filter((B) => B.endCode !== _.code);
		else (F = F.filter((B) => B.endCode !== _.endCode)), F.push(_);
	return F;
}
function JP(D) {
	return KQ(D)
		.map(({ endCode: B }) => B)
		.reverse()
		.join("");
}
function O4(D, F, _) {
	let B = QP(D, _),
		$ = [],
		Z = 0,
		q = "",
		X = !1;
	for (let Q of B) {
		if (_ !== void 0 && Z >= _) break;
		if (Q.type === "ansi") {
			if (($.push(Q), X)) q += Q.code;
		} else {
			if (!X && Z >= F)
				(X = !0), ($ = KQ($)), (q = $.map(({ code: J }) => J).join(""));
			if (X) q += Q.value;
			Z += Q.isFullWidth ? 2 : Q.value.length;
		}
	}
	return (q += JP($)), q;
}
var zP = 24,
	w4 = ({ columns: D = 80 }) => D,
	AP = (D, F) => {
		let _ = D.rows ?? zP,
			B = F.split(`
`),
			$ = Math.max(0, B.length - _);
		return $
			? O4(
					F,
					VD(
						B.slice(0, $).join(`
`),
					).length + 1,
				)
			: F;
	};
function R8(D, { showCursor: F = !1 } = {}) {
	let _ = 0,
		B = w4(D),
		$ = "",
		Z = () => {
			($ = ""), (B = w4(D)), (_ = 0);
		},
		q = (...X) => {
			if (!F) s2.hide();
			let Q = AP(
					D,
					X.join(" ") +
						`
`,
				),
				J = w4(D);
			if (Q === $ && B === J) return;
			($ = Q),
				(B = J),
				(Q = M4(Q, J, { trim: !1, hard: !0, wordWrap: !1 })),
				D.write($F.eraseLines(_) + Q),
				(_ = Q.split(`
`).length);
		};
	return (
		(q.clear = () => {
			D.write($F.eraseLines(_)), Z();
		}),
		(q.done = () => {
			if ((Z(), !F)) s2.show();
		}),
		q
	);
}
var GS = R8(YQ.stdout);
var VS = R8(YQ.stderr);
var P8 = async (
	D = [],
	{
		clear: F = !1,
		hat: _ = "",
		tie: B = "",
		stdin: $ = process.stdin,
		stdout: Z = process.stdout,
	} = {},
) => {
	let q = Array.isArray(D) ? D : [D],
		X = IQ.createInterface({ input: $, escapeCodeTimeout: 50 }),
		Q = R8(Z, { showCursor: !1 });
	IQ.emitKeypressEvents($, X);
	let J = 0,
		z = !1,
		A = async () => {
			if (($.off("keypress", A), $.isTTY)) $.setRawMode(!1);
			if ((X.close(), (z = !0), J < q.length - 1)) Q.clear();
			else if (F) Q.clear();
			else Q.done();
		};
	if ($.isTTY) $.setRawMode(!0);
	$.on("keypress", (K, I) => {
		if ($.isTTY) $.setRawMode(!0);
		let M = ZQ(I, !0);
		if (M === "abort") return A(), process.exit(0);
		if (["up", "down", "left", "right"].includes(M)) return;
		A();
	});
	let L = nD()
			? ["\u2022", "\u2022", "o", "o", "\u2022", "O", "^", "\u2022"]
			: [
					"\u25CF",
					"\u25CF",
					"\u25CF",
					"\u25CF",
					"\u25CF",
					"\u25CB",
					"\u25CB",
					"\u2022",
				],
		G = nD()
			? ["\u2022", "O", "*", "o", "o", "\u2022", "-"]
			: [
					"\u2022",
					"\u25CB",
					"\u25A0",
					"\u25AA",
					"\u25AB",
					"\u25AC",
					"\u25AD",
					"-",
					"\u25CB",
				],
		H = nD() ? ["\u2014", "|"] : ["\u2500", "\u2502"],
		V = nD() ? ["+", "+", "+", "+"] : ["\u256D", "\u256E", "\u2570", "\u256F"],
		C = (K, { mouth: I = G[0], eye: M = L[0] } = {}) => {
			let [P, O] = H,
				[w, x, Y, y] = V,
				b0 = P.repeat(3 - i6(_).split("").length),
				WD = P.repeat(3 - i6(B).split("").length);
			return [
				`${w}${P.repeat(2)}${_}${b0}${x}  ${U.bold(U.cyan("Assistant:"))}`,
				`${O} ${M} ${U.cyanBright(I)} ${M}  ${K}`,
				`${Y}${P.repeat(2)}${B}${WD}${y}`,
			].join(`
`);
		};
	for (let K of q) {
		K = await K;
		let I = Array.isArray(K) ? K : K.split(" "),
			M = [],
			P = M1(L),
			O = 0;
		for (let Y of [""].concat(I)) {
			if (Y) M.push(Y);
			let y = M1(G);
			if (O % 7 === 0) P = M1(L);
			if (J === 1) P = M1(L);
			if (
				(Q(`
${C(M.join(" "), { mouth: y, eye: P })}`),
				Q(`
${C(M.join(" "), { mouth: y, eye: P })}`),
				!z)
			)
				await U1(a6(75, 200));
			O++;
		}
		if (!z) await U1(100);
		let w = await Promise.all(I).then((Y) => Y.join(" ")),
			x = `
${C(w, { mouth: nD() ? "u" : "\u25E1", eye: nD() ? "^" : "\u25E0" })}`;
		if ((Q(x), !z)) await U1(a6(1200, 1400));
		J++;
	}
	if (($.off("keypress", A), await U1(100), A(), $.isTTY)) $.setRawMode(!1);
	$.removeAllListeners("keypress");
};
var UQ = async (D) => {
	D.command("info")
		.alias("i")
		.description(`Show information about the ${X0.NAME}`)
		.action(async () => {
			let F = await Q8();
			await P8(
				[
					["Welcome", "to", X0.VERSION],
					`Let's show information about the ${X0.NAME}!`,
				],
				{ clear: !1, hat: "", tie: "" },
			),
				q0(`${F.GITHUB_MARKDOWN_INFO}
`),
				q0(`Author : ${U.green(X0.AUTHOR)}`);
		});
};
var MQ = async (D) => {
	D.name(X0.NAME)
		.version(X0.VERSION, "-v, --version", Z0.PROGRAM.VERSION_DESCRIPTION)
		.action(async () => {
			await P8(["test", "Let's start!"], { clear: !1, hat: "", tie: "" });
		});
};
var RQ = async (D) => {
	D.command("make")
		.alias("m")
		.description(Z0.PROGRAM.MAKE_DESCRIPTION)
		.action(async () => {
			q0("make");
		});
};
var PQ = async () => {
	try {
		let D = new a4(),
			{ exist: F, data: _ } = XB();
		if ((await MQ(D), !F)) s4(), await qQ(D);
		if (F)
			v0(g0.CONFIGS.NAME, _.name),
				v0(g0.CONFIGS.PACKAGE, _.package),
				v0(g0.CONFIGS.DIR, _.dir),
				await RQ(D);
		await UQ(D), D.parse(process.argv);
	} catch (D) {
		console.error(`${Z0.PROGRAM.ERROR_RUN}:`, D);
	}
};
PQ();
