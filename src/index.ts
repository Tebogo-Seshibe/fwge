import FWGE from './FWGE'


declare global
{
	interface Window
	{
		FWGE: any
	}
}


window.FWGE = new FWGE

export { }
