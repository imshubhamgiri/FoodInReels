// tracer.js (or tracer.ts)
import tracer from 'dd-trace';

// Initialize the tracker
tracer.init({
  logInjection: true, // This connects your server logs to your performance graphs automatically
  url:'https://trace.agentless.us5.datadoghq.com',

});

export default tracer;
