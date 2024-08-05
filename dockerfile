FROM public.ecr.aws/careers360/cnext-frontend-base:arm64 AS base
FROM base AS frontend
# Configure project
WORKDIR /home/ubuntu/main/cnext-apitracker-frontend
COPY /package.json /home/ubuntu/main/cnext-apitracker-frontend
RUN npm config set registry https://npm.careers360.com/
RUN pnpm i
COPY . /home/ubuntu/main/cnext-apitracker-frontend
EXPOSE 3000
RUN npm run build
ENTRYPOINT  serve -s build