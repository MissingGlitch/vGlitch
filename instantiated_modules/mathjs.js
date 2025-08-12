const { create, all } = require("mathjs");

const math = create(all);
const evaluate = math.evaluate;
const random = math.randomInt;

// Security Desactivation
math.import({
	// Defatul disabled functions
	"import":				function () { throw new Error("Function import is disabled") },
	"createUnit":			function () { throw new Error("Function createUnit is disabled") },
	"evaluate":				function () { throw new Error("Function evaluate is disabled") },
	"parse":				function () { throw new Error("Function parse is disabled") },

	// Expression functions
	"compile":				function () { throw new Error("Function compile is disabled") },
	"help":					function () { throw new Error("Function help is disabled") },
	"parser":				function () { throw new Error("Function parser is disabled") },

	// Algebra functions
	"derivative":			function () { throw new Error("Function derivative is disabled") },
	"leafCount":			function () { throw new Error("Function leafCount is disabled") },
	"lsolve":				function () { throw new Error("Function lsolve is disabled") },
	"lsolveAll":			function () { throw new Error("Function lsolveAll is disabled") },
	"lup":					function () { throw new Error("Function lup is disabled") },
	"lusolve":				function () { throw new Error("Function lusolve is disabled") },
	"lyap":					function () { throw new Error("Function lyap is disabled") },
	"polynomialRoot":		function () { throw new Error("Function polynomialRoot is disabled") },
	"qr":					function () { throw new Error("Function qr is disabled") },
	"rationalize":			function () { throw new Error("Function rationalize is disabled") },
	"resolve":				function () { throw new Error("Function resolve is disabled") },
	"schur":				function () { throw new Error("Function schur is disabled") },
	"simplify":				function () { throw new Error("Function simplify is disabled") },
	"simplifyConstant":		function () { throw new Error("Function simplifyConstant is disabled") },
	"simplifyCore":			function () { throw new Error("Function simplifyCore is disabled") },
	"slu":					function () { throw new Error("Function slu is disabled") },
	"sylvester":			function () { throw new Error("Function sylvester is disabled") },
	"symbolicEqual":		function () { throw new Error("Function symbolicEqual is disabled") },
	"usolve":				function () { throw new Error("Function usolve is disabled") },
	"usolveAll":			function () { throw new Error("Function usolveAll is disabled") },

	// Arithmetic functions
	"ceil":					function () { throw new Error("Function ceil is disabled") },
	"dotDivide":			function () { throw new Error("Function dotDivide is disabled") },
	"dotMultiply":			function () { throw new Error("Function dotMultiply is disabled") },
	"dotPow":				function () { throw new Error("Function dotPow is disabled") },
	"expm1":				function () { throw new Error("Function expm1 is disabled") },
	"hypot":				function () { throw new Error("Function hypot is disabled") },
	"invmod":				function () { throw new Error("Function invmod is disabled") },
	"log1p":				function () { throw new Error("Function log1p is disabled") },
	"norm":					function () { throw new Error("Function norm is disabled") },
	"nthRoots":				function () { throw new Error("Function nthRoots is disabled") },
	"xgcd":					function () { throw new Error("Function xgcd is disabled") },

	// Bitwise functions
	"bitAnd":				function () { throw new Error("Function bitAnd is disabled") },
	"bitNot":				function () { throw new Error("Function bitNot is disabled") },
	"bitOr":				function () { throw new Error("Function bitOr is disabled") },
	"bitXor":				function () { throw new Error("Function bitXor is disabled") },
	"leftShift":			function () { throw new Error("Function leftShift is disabled") },
	"rightArithShift":		function () { throw new Error("Function rightArithShift is disabled") },
	"rightLogShift":		function () { throw new Error("Function rightLogShift is disabled") },

	// Combinatorics functions
	"bellNumbers":			function () { throw new Error("Function bellNumbers is disabled") },
	"catalan":				function () { throw new Error("Function catalan is disabled") },
	"composition":			function () { throw new Error("Function composition is disabled") },
	"stirlingS2":			function () { throw new Error("Function stirlingS2 is disabled") },

	// Complex functions
	"arg":					function () { throw new Error("Function arg is disabled") },
	"conj":					function () { throw new Error("Function conj is disabled") },
	"im":					function () { throw new Error("Function im is disabled") },
	"re":					function () { throw new Error("Function re is disabled") },

	// Geometry functions
	"distance":				function () { throw new Error("Function distance is disabled") },
	"intersect":			function () { throw new Error("Function intersect is disabled") },

	// Logical functions
	"and":					function () { throw new Error("Function and is disabled") },
	"not":					function () { throw new Error("Function not is disabled") },
	"or":					function () { throw new Error("Function or is disabled") },
	"xor":					function () { throw new Error("Function xor is disabled") },

	// Matrix functions
	"apply":				function () { throw new Error("Function apply is disabled") },
	"column":				function () { throw new Error("Function column is disabled") },
	"concat":				function () { throw new Error("Function concat is disabled") },
	"count":				function () { throw new Error("Function count is disabled") },
	"cross":				function () { throw new Error("Function cross is disabled") },
	"ctranspose":			function () { throw new Error("Function ctranspose is disabled") },
	"det":					function () { throw new Error("Function det is disabled") },
	"diag":					function () { throw new Error("Function diag is disabled") },
	"diff":					function () { throw new Error("Function diff is disabled") },
	"dot":					function () { throw new Error("Function dot is disabled") },
	"eigs":					function () { throw new Error("Function eigs is disabled") },
	"expm":					function () { throw new Error("Function expm is disabled") },
	"fft":					function () { throw new Error("Function fft is disabled") },
	"filter":				function () { throw new Error("Function filter is disabled") },
	"flatten":				function () { throw new Error("Function flatten is disabled") },
	"forEach":				function () { throw new Error("Function forEach is disabled") },
	"getMatrixDataType":	function () { throw new Error("Function getMatrixDataType is disabled") },
	"identity":				function () { throw new Error("Function identity is disabled") },
	"ifft":					function () { throw new Error("Function ifft is disabled") },
	"inv":					function () { throw new Error("Function inv is disabled") },
	"kron":					function () { throw new Error("Function kron is disabled") },
	"map":					function () { throw new Error("Function map is disabled") },
	"matrixFromColumns":	function () { throw new Error("Function matrixFromColumns is disabled") },
	"matrixFromFunction":	function () { throw new Error("Function matrixFromFunction is disabled") },
	"matrixFromRows":		function () { throw new Error("Function matrixFromRows is disabled") },
	"ones":					function () { throw new Error("Function ones is disabled") },
	"partitionSelect":		function () { throw new Error("Function partitionSelect is disabled") },
	"pinv":					function () { throw new Error("Function pinv is disabled") },
	"range":				function () { throw new Error("Function range is disabled") },
	"reshape":				function () { throw new Error("Function reshape is disabled") },
	"resize":				function () { throw new Error("Function resize is disabled") },
	"rotate":				function () { throw new Error("Function rotate is disabled") },
	"rotationMatrix":		function () { throw new Error("Function rotationMatrix is disabled") },
	"row":					function () { throw new Error("Function row is disabled") },
	"size":					function () { throw new Error("Function size is disabled") },
	"sort":					function () { throw new Error("Function sort is disabled") },
	"sqrtm":				function () { throw new Error("Function sqrtm is disabled") },
	"squeeze":				function () { throw new Error("Function squeeze is disabled") },
	"subset":				function () { throw new Error("Function subset is disabled") },
	"trace":				function () { throw new Error("Function trace is disabled") },
	"transpose":			function () { throw new Error("Function transpose is disabled") },
	"zeros":				function () { throw new Error("Function zeros is disabled") },

	// Numeric functions
	"solveODE":				function () { throw new Error("Function solveODE is disabled") },

	// Probability functions
	"gamma":				function () { throw new Error("Function gamma is disabled") },
	"kldivergence":			function () { throw new Error("Function kldivergence is disabled") },
	"lgamma":				function () { throw new Error("Function lgamma is disabled") },
	"multinomial":			function () { throw new Error("Function multinomial is disabled") },
	"pickRandom":			function () { throw new Error("Function pickRandom is disabled") },

	// Relational functions
	"compareNatural":		function () { throw new Error("Function compareNatural is disabled") },
	"compareText":			function () { throw new Error("Function compareText is disabled") },
	"deepEqual":			function () { throw new Error("Function deepEqual is disabled") },
	"equalText":			function () { throw new Error("Function equalText is disabled") },

	// Set functions
	"setCartesian":			function () { throw new Error("Function setCartesian is disabled") },
	"setDifference":		function () { throw new Error("Function setDifference is disabled") },
	"setDistinct":			function () { throw new Error("Function setDistinct is disabled") },
	"setIntersect":			function () { throw new Error("Function setIntersect is disabled") },
	"setIsSubset":			function () { throw new Error("Function setIsSubset is disabled") },
	"setMultiplicity":		function () { throw new Error("Function setMultiplicity is disabled") },
	"setPowerset":			function () { throw new Error("Function setPowerset is disabled") },
	"setSize":				function () { throw new Error("Function setSize is disabled") },
	"setSymDifference":		function () { throw new Error("Function setSymDifference is disabled") },
	"setUnion":				function () { throw new Error("Function setUnion is disabled") },

	// Signal functions
	"freqz":				function () { throw new Error("Function freqz is disabled") },
	"zpk2tf":				function () { throw new Error("Function zpk2tf is disabled") },

	// Special functions
	"erf":					function () { throw new Error("Function erf is disabled") },
	"zeta":					function () { throw new Error("Function name is disabled") },

	// Statistics functions
	"corr":					function () { throw new Error("Function corr is disabled") },
	"cumsum":				function () { throw new Error("Function cumsum is disabled") },
	"mad":					function () { throw new Error("Function mad is disabled") },
	"prod":					function () { throw new Error("Function prod is disabled") },
	"quantileSeq":			function () { throw new Error("Function quantileSeq is disabled") },
	"std":					function () { throw new Error("Function std is disabled") },
	"variance":				function () { throw new Error("Function variance is disabled") },

	// String functions
	"format":				function () { throw new Error("Function format is disabled") },
	"print":				function () { throw new Error("Function print is disabled") },

	// Trigonometry functions
	"acos":					function () { throw new Error("Function acos is disabled") },
	"acosh":				function () { throw new Error("Function acosh is disabled") },
	"acot":					function () { throw new Error("Function acot is disabled") },
	"acoth":				function () { throw new Error("Function acoth is disabled") },
	"acsc":					function () { throw new Error("Function acsc is disabled") },
	"acsch":				function () { throw new Error("Function acsch is disabled") },
	"asec":					function () { throw new Error("Function asec is disabled") },
	"asech":				function () { throw new Error("Function asech is disabled") },
	"asin":					function () { throw new Error("Function asin is disabled") },
	"asinh":				function () { throw new Error("Function asinh is disabled") },
	"atan":					function () { throw new Error("Function atan is disabled") },
	"atan2":				function () { throw new Error("Function atan2 is disabled") },
	"atanh":				function () { throw new Error("Function atanh is disabled") },
	"cos":					function () { throw new Error("Function cos is disabled") },
	"cosh":					function () { throw new Error("Function cosh is disabled") },
	"cot":					function () { throw new Error("Function cot is disabled") },
	"coth":					function () { throw new Error("Function coth is disabled") },
	"csc":					function () { throw new Error("Function csc is disabled") },
	"csch":					function () { throw new Error("Function csch is disabled") },
	"sec":					function () { throw new Error("Function sec is disabled") },
	"sech":					function () { throw new Error("Function sech is disabled") },
	"sin":					function () { throw new Error("Function sin is disabled") },
	"sinh":					function () { throw new Error("Function sinh is disabled") },
	"tan":					function () { throw new Error("Function tan is disabled") },
	"tanh":					function () { throw new Error("Function tanh is disabled") },

	// Utils functions
	"clone":				function () { throw new Error("Function clone is disabled") },

	// Other functions
	"string":				function () { throw new Error("Function string is disabled") },
	"boolean":				function () { throw new Error("Function boolean is disabled") },
	"bignumber":			function () { throw new Error("Function boolean is disabled") }

	// Format:
	// "name":		function () { throw new Error("Function name is disabled") }
}, { override: true });

module.exports = { evaluate, random };