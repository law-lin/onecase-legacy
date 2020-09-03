import mixpanel from "mixpanel-browser";
mixpanel.init("b1a1c3593c366d9b3af9442cd4972455", {
  api_host: "https://api.mixpanel.com",
});

let env_check = process.env.NODE_ENV === "production";

let actions = {
  identify: (id) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name, props) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;
