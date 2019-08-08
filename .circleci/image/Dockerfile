FROM gcr.io/google_appengine/nodejs

ENV TERM=dumb

RUN apt-get update && apt-get install apt-utils --yes && apt-get install lsb-release

RUN DEBIAN_FRONTEND=noninteractive apt-get install bc --yes
# bc is used in our golive scripts.
RUN apt-get install bc 

# we use sed to do find and replace on certain files
RUN apt-get install sed

RUN export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)" && \
    echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    DEBIAN_FRONTEND=noninteractive apt-get update -y && DEBIAN_FRONTEND=noninteractive apt-get install google-cloud-sdk -y

WORKDIR /app/
ENV NODE_ENV dev

CMD ["/bin/sh"]