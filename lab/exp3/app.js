angular.module('tableApp', [])
  .controller('TableController', function() {
    const vm = this;

    vm.students = [
      { name: 'shikha chauhan', age: 20, dept: 'medical' },
      { name: 'ishika gussain', age: 20, dept: 'management' },
      { name: 'saloni negi', age: 20, dept: 'n/a' },
      { name: 'nileshwar pratap gahloth', age: 19, dept: 'CS' },
      { name: 'n/a', age: 19, dept: 'n/a' }
    ];

    vm.sortKey = 'name';
    vm.reverse = false;
  });