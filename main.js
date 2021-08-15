const backEnd = 'run_python.php';

const btnAdd = document.querySelector('.btn-add');
const container = document.querySelector('.container');

const processResponse = (result, runBtn) => {
	console.log(result);
	runBtn.textContent = 'Completed';
	runBtn.disabled = true;
	runBtn.classList.add('disabled');
};

const runInterface = e => {
	e.preventDefault();
	const runBtn = e.target;
	target = runBtn.closest('.device');
	if(!!target) {
		const deviceIP = target.querySelector('.deviceIP');
		const deviceInt = target.querySelector('.deviceInt');
		if(deviceIP.value.length < 5 || deviceInt.value.length < 5)
		{
			alert('Wrong parameters');
			deviceIP.focus();
			return false;
		}
		runCommand({
			'ip': deviceIP.value,
			'int': deviceInt.value,
		}, processResponse, runBtn);
	}
	
};

const addNewDevice = () => {
	const div = document.createElement('div');
	div.classList.add('device');
	div.innerHTML = `
		<input type="text" class="deviceIP" required placeholder="IP address" value="" size="40">
		<input type="text" class="deviceInt" required placeholder="Interface" value="" size="20">
		<button type="button" class="btn-run added-run">Run</button>
	`;
	container.append(div);
	init();
};

const init = () => {
	const btnsRun = document.querySelectorAll('.btn-run.added-run');
	for (btnRun of btnsRun)
	{
		btnRun.classList.remove('added-run');
		btnRun.addEventListener('click', runInterface);
	}
};

const runCommand = async (request_data, callback, runBtn) => {
	const formdata = new FormData();
	for(const param in request_data) {
		formdata.append(param, request_data[param]);
	}

	const requestOptions = {
		method: 'POST',
		body: formdata,
	};

	const data = await fetch(backEnd, requestOptions);

	if(data.ok) {
		let result = await data.json();
		if(result.code === 1) {
			callback(result, runBtn);
		}
	} else {
		throw new Error(`Error ${data.status} ${data.statusText}`);
	}
};

btnAdd.addEventListener('click', addNewDevice);

container.textContent = '';

addNewDevice();