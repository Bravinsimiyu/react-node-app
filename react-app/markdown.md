[Docker](https://docs.docker.com/get-docker/) is an open-source virtualization platform that delivers and runs applications in packages called containers. A [Docker Container](https://www.docker.com/resources/what-container/) is a standalone and executable package that contains all the dependencies and code functionalities needed for an application to run properly. A Docker Container is lightweight and is more shared among team members in an organization. 

[Kubernetes](https://kubernetes.io/) is a container orchestration platform for automating the deployment and management of containers. Kubernetes hosts the containerized application in a set of nodes known as a Kubernetes cluster. A Kubernetes cluster consists of two types of nodes: [master nodes](https://kubernetes.io/docs/concepts/overview/components/) and [worker nodes](https://kubernetes.io/docs/concepts/overview/components/). Master nodes handle administrative tasks and management of the deployed containers. The worker nodes are responsible for running these deployed containerized applications. Worker nodes also perform the tasks the master node assigns to them such as maintaining traffic between the applications.

You can easily deploy a Docker Container to any Kubernetes cluster using the [Kubernetes CLI](https://kubernetes.io/docs/reference/kubectl/). The Kubernetes CLI, kubectl, is a command line interface tool that allows you to communicate and interact with any Kubernetes cluster. You use this tool to run `kubectl` commands that will allow you to deploy a containerized application to a Kubernetes Cluster. It enables you to create, manage, access, and modify resources on your Kubernetes Cluster. 

In this article, we will use Kubernetes CLI to deploy a Dockerized React.js application to a local Kubernetes Cluster known as [Minikube](https://minikube.sigs.k8s.io/docs/start/). To easily follow this tutorial you must be familiar with Docker, also ensure that [Docker Desktop](https://www.docker.com/products/docker-desktop/) is correctly installed on your computer. Let's start building a "Hello world" [React.js](https://reactjs.org/) application.

### Building the React.js application
To start, we will create a React.js application using the following `npx` command:

```npx
npx create-react-app react-app
```
The command will create a single-page React application. To start the created React app, run the following `npm` command, in your terminal:

```npm
npm start
```
The command will start and run the React.js application on http://localhost:3000/ as shown in the image below:

[Image 1](image1.png)

To modify the React application, navigate through the `react-app` directory and open the `src` folder. In the `src` folder, open the `App.js` file, delete its content and add the following code snippet:

```react
function App() {
  return (
    <div className="App">
      <h1>Hello World!</h1>
    </div>
  );
}

export default App;
```
The code above will create a "Hello World" application. To launch the React app, run the following command, in your terminal:

```npm
npm start
```
The command will launch and run the React.js application on http://localhost:3000/ as shown in the image below:

[Image 2](image2.png)

Our React app is up and running, let's now create a Docker container for the application.

### Creating a Docker Container for the React.js application
We will use a [Dockerfile](https://docs.docker.com/engine/reference/builder/) to build a Docker image for the application. We will then run the Docker Image and it will launch a Docker Container for the React.js application. A Dockerfile contains instructions and commands that the Docker Engine uses to build a Docker Image. 

In the `react-app` directory, create a new `Dockerfile`. Open the file and add the following content:

```docker
#we will build the React.js application using Node as the base image
FROM node:18-alpine

#creates a working directory that will store the Containerized application
WORKDIR /app

#copying the React.js application libraries and dependencies to the working directory
COPY package.json .

#installs all the copied React.js application libraries and dependencies in the Docker container
RUN npm install

#copies all the files for the React.js application into the working directory
COPY . .

#The Ract.js application will run on this port
EXPOSE 3000

#command to start the React.js containerized application
CMD ["npm", "start"]
```
#### Building the Docker Image
To build a Docker Image, apply the following command in your terminal:

```docker
docker build -t vibhorchinda/react-app/react-app .
```
The Docker command will build a Docker Image and display the following output in your terminal:

[Image 3](image3.png)

#### Pushing the Docker Image to Docker Hub
To push the `vibhorchinda/react-app` image to Docker Hub, apply the following command:

```docker
docker login
docker push vibhorchinda/react-app
```
### Running the Docker Image
We will run the Docker Image to launch a Docker Container, using the following Docker command:

```docker
docker run -p 3000:3000 vibhorchinda/react-app
```
The command will launch a Docker Container. The containerized application will run on http://localhost:3000/ as shown in the image below:

[Image 4](image4.png)

Now that our containerized application is running, the next step is to install the Kubernetes CLI.

### Installing the Kubernetes CLI
To install the Kubernetes CLI, apply the following commands:

1. Windows installation
To install Kubernetes CLI on Windows, you can use [Chocolatey](https://chocolatey.org/) package manager as follows:

```choco
choco install kubernetes-cli
```

2. macOS installation
To install Kubernetes CLI on macOS, you can use using [Homebrew](https://brew.sh/) package manager as follows:

```brew
brew install kubectl
```

3. Linux installation
To install Kubernetes CLI on Linux, you can use [Snap](https://snapcraft.io/docs/core/install) package manager as follows:

```snap
snap install kubectl --classic
```
After the installation process, you can check the installed Kubernetes CLI version using the following `kubectl` command:

```kubectl
kubectl version --client
```
We will use the installed Kubernetes CLI to deploy the React.js application to Minikube. The next step is to create a Minikube Kubernetes cluster.

### Creating a Minikube Kubernetes Cluster
Minikube is a lightweight local Kubernetes engine that enables you to create a Kubernetes cluster on your computer. It comes with Docker Desktop and is best suited for hosting simple containerized applications. All you need to create and run a Minikube Kubernetes Cluster is Docker. It is available and compatible with Windows, macOS, and Linux.

To start and create a Minikube cluster, run the following commands:

```minikube
minikube config set driver docker
miikube start
```
The commands will create a Minikube cluster and give the following output:

[Image 5](image5.png)

Our Kubernetes cluster is up and running. The next step is to deploy the React.js containerized application to the created Minikube cluster.

### Deploying the React.js containerized application to the created Minikube cluster
To deploy the React.js containerized application to the created Minikube cluster, we need a `kubernetes-deployment.yaml` file. This file will define the resources that the deployed application will require to run on the cluster. The Kubernetes CLI will take the file and use it to deploy the containerized applications. It also specifies the type of Kubernetes Service that will be assigned to the deployed application.

In the `react-app` directory, create a new file named `kubernetes-deployment.yaml`. Open the file and add the following content:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: react-app-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: react-app
  template:
    metadata:
      labels:
        app: react-app
    spec:
      containers:
      - name: react-app
        image: vibhorchinda/react-app
        resources:
          limits:
            memory: "356Mi"
            cpu: "500m"
        ports:
        - containerPort: 3000

---

apiVersion: v1
kind: Service
metadata:
  name: react-app-service
spec:
  type: LoadBalancer
  selector:
    app: react-app
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
```
The `kubernetes-deployment.yaml` is made up of the `Deployment` and `Service` parts.

1. The `Deployment` part
This part specifies the number of pods that will be created in the Kubernetes cluster. A pod is a unit of replica sets on a Kubernetes cluster. It ensures multiple instances of the application are running. It specifies the Docker image (vibhorchinda/react-app) that kubectl will use to create the containers. It also specifies the compute resource limit for each pod.

2. The `Service` part
This part specifies the type of Kubernetes Service the deployed application will have. It will use the Kubernetes `LoadBalancer` as the service type. This service will expose the application using an External IP address. It will enable the application to be accessed and viewed in the web browser. It also distributes traffic to all Kubernetes pods in the Kubernetes cluster when a person wants to access the application. 

Let's apply the `kubectl` command to deploy the React.js application.

#### Applying the kubectl commands
To deploy the React.js application, apply the following `kubectl` command in your terminal:

```kubectl
kubectl apply -f kubernetes-deployment.yaml
```
The output is shown below:

[Image 6](image6.png)

#### Getting the Deployment
To get the deployment, run the following `kubectl` command:

```kubectl
kubectl get deployment
```
The deployment is shown in the image below:

[Image 7](image7.png)

### Getting the Pods
To get the created pods in the Kubernetes Cluster, run the following `kubectl` command:

```kubectl
kubectl get pods
```
The created pods are shown in the image below:

[Image 8](image8.png)

### Getting the Service
To get the created `react-app-service`, run the following `kubectl` command:

```kubectl
kubectl get service
```
The created service is shown in the image below:

[Image 9](image9.png)

From the image above, Minikube has not assigned an IP address to the `react-app-service`. To make Minikube assign an External IP address, run the following Minikube command:

```minikube
minikube service react-app-service
```
The command will assign http://127.0.0.1:9209 to the created service as an External IP address. 

[Image 10](image10.png)

We have deployed the React.js Docker Container to the Kubernetes cluster. We can access and view the deployed application using the assigned IP address as shown in the image below:

[Image 11](image11.png)

### Conclusion
In this article, we have learned how to deploy Docker Containers to the Kubernetes Cluster using Kubernetes CLI. We created a React.js application using the following `npx` command and then modified the `App.js` file. We then created a Docker Container for the React.js application and pushed the Docker image to Docker Hub.

We installed the Kubernetes CLI and created a Minikube Kubernetes Cluster. We then deployed the React.js containerized application to the created Minikube cluster using the `kubectl` commands. We also viewed the Deployment, Pods, and Service using `kubectl`. Finally, we accessed the deployed application using an External IP address. Hope you find this article useful and Happy Learning!
