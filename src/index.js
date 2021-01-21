const arg = require('arg');
const dotenv = require('dotenv');
const terminus = require('./plugins/Terminus.js');

const terminusDomains = async uuid => await terminus.request(`/sites/${uuid}/environments/live/domains`);

dotenv.config();

(async () => {

  const args = arg({
    '--uuid': String,
    '-u': '-uuid'
  }, {
    argv: process.argv.slice(2)
  });
  const orgUuid = args['--uuid'];

  // Get the complete site list for the org in question
  const sites = await terminus.request(`/organizations/${orgUuid}/memberships/sites`)

  const reqs = sites.data.map(site => terminusDomains(site.site_id))
  const rawResps = await Promise.all(reqs)
  const resps = rawResps.map(resp => {
    const data = resp.data
    const domains = data.filter(d => d.type !== 'platform')
    const siteUuid = resp.data[0].site_id
    let domainList = 'n/a'
    if (domains.length > 0) {
      domainList = domains.map(d => d.id).join(',')
    }
    const primaryDomainList = domains.filter(d => d.primary)
    let primaryDomain = 'n/a'
    if (primaryDomainList.length > 0) {
      primaryDomain = primaryDomainList[0].id
    }

    return {
      siteUuid,
      domainList,
      primaryDomain
    }
  })

  const csvOut = resps.map(resp => `"${resp.siteUuid}","${resp.domainList}","${resp.primaryDomain}"`).join('\r\n')
  console.log(csvOut)

  process.exit();

})();
