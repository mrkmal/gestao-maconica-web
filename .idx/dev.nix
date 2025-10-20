# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # pkgs.go
    # pkgs.python311
    # pkgs.python311Packages.pip
    pkgs.nodejs_20
    # pkgs.nodePackages.nodemon
  ];

  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];
    
    # The following ports are forwarded from your workspace to your local machine.
    # The name of the port is mandatory, but the description is optional.
    forwardPorts = [
      {
        name = "http-server";
        port = 8080;
        # visit the forwarded port in a new tab
        open = true;
        # or, open the URL in a new tab
        # open = "http://localhost:8080/my/path"
      }
    ];

    # Enable this to shut down the workspace when the last VS Code window is closed.
    # shutDownOnClose = true;
  };

  # Run a command when the workspace starts
  # startup.command = [
  #   "echo 'Welcome to your workspace!'"
  # ];
}
