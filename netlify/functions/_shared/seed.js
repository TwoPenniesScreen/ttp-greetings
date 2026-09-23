const allDay = { enabled: true, start: "00:00", end: "23:59" };
const off = { enabled: false, start: "00:00", end: "23:59" };
const schedule = windows => Object.fromEntries(["mon","tue","wed","thu","fri","sat","sun"].map(day => [day, windows[day] || off]));
const everyDay = schedule({ mon:allDay,tue:allDay,wed:allDay,thu:allDay,fri:allDay,sat:allDay,sun:allDay });
const slide = (id, headline, subheading, options={}) => ({ id, name:options.name || headline, headline, subheading, logo:"two-pennies", weight:options.weight || 1, enabled:true, starts:"", ends:"", schedule:options.schedule || everyDay });
const day = (name, start="00:00", end="23:59") => schedule({ [name]:{enabled:true,start,end} });
const beforeFive = schedule(Object.fromEntries(["mon","tue","wed","thu","fri","sat","sun"].map(day => [day,{enabled:true,start:"00:00",end:"17:00"}])));

export const seedSlides = [
  slide("good-to-see-you","GOOD TO SEE YOU",""),
  slide("good-to-be-out","GOOD TO BE OUT","EVEN BETTER HERE"),
  slide("unwind","UNWIND","LEAVE THE REST OUTSIDE"),
  slide("hire-the-bar","HIRE THE BAR","AVAILABLE FOR PRIVATE HIRE\nASK AT THE BAR FOR DETAILS"),
  slide("good-company","GOOD COMPANY","YOU'RE AREET HERE"),
  slide("friday-afternoon","FRIDAY AFTERNOON","SLOW IT DOWN",{weight:5,schedule:day("fri","00:00","16:00")}),
  slide("week-ends-here","THE WEEK ENDS HERE","AND THE WEEKEND BEGINS",{weight:5,schedule:day("sat","16:00","19:00"),name:"Friday 4–7 (AbleSign timing)"}),
  slide("friday-evening","FRIDAY","DON'T RUSH HOME",{weight:5,schedule:day("fri","19:00","23:59")}),
  slide("saturday-afternoon","SATURDAY AFTERNOON","TAKE YOUR TIME",{weight:5,schedule:day("sat","00:00","18:00")}),
  slide("days-done","THE DAY'S DONE","SATURDAY CONTINUES",{weight:5,schedule:day("sat","18:00","20:00")}),
  slide("saturday-night","SATURDAY NIGHT","NOTHING ELSE MATTERS",{weight:5,schedule:day("sat","20:00","23:59")}),
  slide("easy-sunday","EASY SUNDAY","YOU'RE WELCOME HERE",{weight:5,schedule:day("sun","00:00","16:00")}),
  slide("settled-in","SETTLED IN","SUNDAY",{weight:5,schedule:day("sun","16:00","19:00")}),
  slide("sunday-evening","SUNDAY EVENING","UNRUSHED",{weight:5,schedule:day("sun","19:00","23:59")}),
  slide("welcome","WELCOME TO","YOUR LOCAL IN THE HEART OF\nNORTH SHIELDS",{weight:5,schedule:schedule({mon:allDay,tue:allDay,wed:allDay,thu:allDay})}),
  slide("beer-or-wine","BEER OR WINE","WHAT'S YOUR CHOICE?"),
  slide("alcohol-free","ALCOHOL FREE","WE'VE GOT YOU"),
  slide("small-bar-big-heart","SMALL BAR, BIG HEART","YOUR LOCAL IN THE HEART OF\nNORTH SHIELDS"),
  slide("toasties-made-to-order","TOASTIES","MADE TO ORDER",{weight:5,schedule:beforeFive}),
  slide("time-well-spent","TIME WELL SPENT","GLAD YOU STAYED"),
  slide("ipa-or-lager","IPA OR LAGER","WHAT'S YOUR CHOICE?"),
  slide("youre-here","YOU'RE HERE","THAT'S WHAT MATTERS"),
  slide("toasties-ask-at-bar","TOASTIES","ASK AT THE BAR",{weight:5,schedule:beforeFive}),
  slide("hello","HELLO",""),
  slide("monday-out-there","MONDAY OUT THERE","MUCH BETTER IN HERE",{weight:5,schedule:day("mon")}),
  slide("just-a-tuesday","JUST A TUESDAY","NO NEED TO RUSH",{weight:5,schedule:day("tue")}),
  slide("week-bends-here","THE WEEK BENDS HERE","TAKE THE EDGE OFF",{weight:5,schedule:day("wed")}),
  slide("nearly-weekend","NEARLY THE WEEKEND","NO NEED TO RUSH IT",{weight:5,schedule:day("thu")}),
  slide("friday","FRIDAY","TAKE THE EDGE OFF",{weight:5,schedule:day("fri")}),
  slide("dont-overthink-it","DON'T OVERTHINK IT","IT'S SATURDAY",{weight:5,schedule:day("sat")}),
  slide("sunday","SUNDAY","NO HURRY",{weight:5,schedule:day("sun")})
];
