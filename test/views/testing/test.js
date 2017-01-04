var tests = [];

var server = (function()
{
	function Server()
	{
		var $ = this;
		var _XML = new XMLHttpRequest();

		$.send = function send(message, callback)
		{
			_XML.open("GET", "/testing/" + message, true);
			_XML.send(null);

			_XML.onreadystatechange = function onreadystatechange()
			{
				if ((_XML.readyState === _XML.DONE) && (_XML.status === 0 || _XML.status === 200))
					callback(_XML.responseText, null);
			};

			_XML.error = function error()
			{
				callback(null, "Failed to complete request: " + message);
			};
		};
	}

	return new Server();
})();

function Tester(object)
{
	var $ = this;
	
	$.Id = object.id;
	$.Description = object.description;
	$.Failed = 0;
	$.Passed = 0;
	$.Total = object.tests.length;
	$.Current = undefined;
	$.Vars = {};

	$.Init = function Init()
	{
		for (var i = 0; i < object.init.length; ++i)
		{
			$.Current = new Function(object.init[i]);
			$.Current();
		}
	};

	$.Test = function Test()
	{
		for (var i = 0; i < object.tests.length; ++i)
		{
			$.Current = new Function(object.tests[i]);
			var success = $.Current();

			if (success)
				$.Passed++;
			else
			{
				$.Failed++;
				console.log("Failed:", object.tests[i]);
			}
		}
	};

	$.Finish = function Finish()
	{
		for (var i = 0; i < object.finish.length; ++i)
		{
			$.Current = new Function(object.finish[i]);
			$.Current();
		}
	};

	$.Print = function Print()
	{
		var body = document.getElementById("test-body");

		var tr = document.createElement("tr");
		var number = document.createElement("td");
		var description = document.createElement("td");
		var failed = document.createElement("td");
		var passed = document.createElement("td");
		var total = document.createElement("td");

		number.innerHTML = $.Id;
		description.innerHTML = $.Description;
		failed.innerHTML = $.Failed;
		passed.innerHTML = $.Passed;
		total.innerHTML = $.Total;

		tr.appendChild(number);
		tr.appendChild(description);
		tr.appendChild(failed);
		tr.appendChild(passed);
		tr.appendChild(total);
		body.appendChild(tr);
	}
};

function run_tests()
{
	tests.forEach(function test(item, index)
	{
		item.Init();
		item.Test();
		item.Finish();
		item.Print();		
	});	
}

window.onload = function onload()
{
	server.send("tests", function(res, err)
	{
		if (!!err)
			alert(err);
		else
		{
			JSON.parse(res).forEach(function(item, index)
			{
				tests[index] = new Tester(item);
			});

			run_tests();
		}
	});
};