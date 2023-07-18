// "{\"id\": \"${{ github.event.pull_request.number }}\", \"labels\": \"${{ steps.pr-labels.outputs.labels }}\", \"files_updated\": \"${{ steps.changed-files.outputs.files_updated }}\", \"files_created\": \"${{ steps.changed-files.outputs.files_created }}\", \"files_deleted\": \"${{ steps.changed-files.outputs.files_deleted }}\",\"body\":\"${{github.event.pull_request.body}}\",\"title\":\"${{github.event.pull_request.title}}\",\"url\":\"${{github.event.pull_request.html_url}}\"}"


function run() {
  // let { REPOSITORY: repository } = process.env
  let { ID: id, LABELS: labels, FILES_UPDATED: files_updated, FILES_CREATED: files_created, FILES_DELETED: files_deleted, BODY: body, TITLE: title, URL: url } = process.env
  // 如果labels的键不存在web或者security，那么就不执行下面的代码
  labels = JSON.parse(labels)
  if (!('web' in labels) && !('security' in labels)) {
    return
  }

  try {
    //post to dfggtr.baidu.com
    fetch('https://np4l5e.laf.run/pr', {
      method: 'POST',
      body: JSON.stringify({
        id,
        labels,
        files_updated,
        files_created,
        files_deleted,
        body,
        title,
        url
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(()=>{
      setOutput('post_result', '成功辣~');
    })

  } catch (e) {
          setFailed(e);

          return;
  }
}

run();