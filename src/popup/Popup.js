import React from 'react';
import './Popup.css';
import * as browser from 'webextension-polyfill';
import helpers from '../helpers/helpers';

const Popup = () => {
  const [filter, setFilter] = React.useState('is:issue is:open');
  const [loading, setLoading] = React.useState(true);
  const [repo, setRepo] = React.useState('');

  React.useEffect(() => {
    helpers.getCurrentTab().then(tab => {
      var _repo = helpers.getRepoFromUrl(tab.url);
      browser.storage.local.get(_repo).then((item) => {
        if(item[_repo])
        {
          setFilter(decodeURIComponent(item[_repo]));
        }
        setRepo(_repo);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
        setFilter('is:issue is:open');
      });
    });
  }, []);

  const onSave = () => {
    helpers.getCurrentTab().then((tab) => {
      var _repo = helpers.getRepoFromUrl(tab.url);
      var uriFilter = encodeURIComponent(filter);
      browser.storage.local.set({[_repo]:uriFilter});
      browser.tabs.sendMessage(tab.id, { filter: uriFilter });
    }).catch(err => console.log(err));
  };

  if(loading)
  {
    return <div className="popup"><br />Loading...</div>;
  }

  return (
    <div className="popup">
      <h3>GitHub Default Issue Filter</h3>
      {repo ? (
        <div>
          <div className="text">Set default issue filter for<br /><b>{repo}</b></div>
          <input type="text" value={filter} onChange={(ev)=>setFilter(ev.target.value)} /><br />
          <button onClick={onSave}>Save Filter</button>
        </div>
      ) : (
        <div>
          <div className="text"><i>Current window/tab isn't a GitHub repo, open a GitHub repo in your browser to set the default issue filter</i></div>
        </div>
      )}
    </div>
  );
};


export default Popup;
