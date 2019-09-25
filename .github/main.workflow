workflow "New workflow" {
  resolves = ["Run Tests"]
  on = "push"
}

action "Install Dependencies" {
  uses = "actions/npm@1.0.0"
  runs = "yarn"
  args = "install"
}

action "Run Tests" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "yarn"
  args = "test"
  needs = ["Install Dependencies"]
}
